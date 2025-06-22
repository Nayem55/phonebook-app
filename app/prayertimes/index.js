import { View, Text, StyleSheet, ScrollView, ActivityIndicator,Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrayerTimesScreen() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchPrayerTimes = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsOnline(networkState.isConnected && networkState.isInternetReachable);

      const cachedPrayerTimes = await AsyncStorage.getItem('cachedPrayerTimes');
      if (cachedPrayerTimes) {
        setPrayerTimes(JSON.parse(cachedPrayerTimes));
      }

      if (networkState.isConnected && networkState.isInternetReachable) {
        const latitude = 23.8103;
        const longitude = 90.4125;
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        const response = await axios.get(
          `http://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=1`
        );
        
        const timings = response.data.data.timings;
        const sunrise = new Date(`${date.toDateString()} ${timings.Sunrise}`);
        const dhuhr = new Date(`${date.toDateString()} ${timings.Dhuhr}`);
        
        const ishraqStart = new Date(sunrise.getTime() + 20 * 60000);
        const chashtStart = new Date(ishraqStart.getTime() + 25 * 60000);
        
        const prayerData = {
          ...timings,
          Ishraq: `${dayjs(ishraqStart).format('HH:mm')} - ${dayjs(chashtStart).format('HH:mm')}`,
          Chasht: `${dayjs(chashtStart).format('HH:mm')} - ${dayjs(dhuhr).format('HH:mm')}`
        };
        
        setPrayerTimes(prayerData);
        await AsyncStorage.setItem('cachedPrayerTimes', JSON.stringify(prayerData));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A5D1A" />
        <Text style={styles.loadingText}>Loading prayer times...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={50} color="#D4AF37" />
        <Text style={styles.errorText}>Failed to load prayer times</Text>
        <Text style={styles.errorSubText}>{error}</Text>
        <Text style={styles.offlineText}>
          {prayerTimes ? 'Showing cached data' : 'No cached data available'}
        </Text>
      </View>
    );
  }

  const mandatoryPrayers = [
    { name: 'Fajr', time: prayerTimes.Fajr, icon: 'sunny-outline' },
    { name: 'Dhuhr', time: prayerTimes.Dhuhr, icon: 'partly-sunny-outline' },
    { name: 'Asr', time: prayerTimes.Asr, icon: 'cloudy-outline' },
    { name: 'Maghrib', time: prayerTimes.Maghrib, icon: 'moon-outline' },
    { name: 'Isha', time: prayerTimes.Isha, icon: 'moon' },
  ];

  const optionalPrayers = [
    { name: 'Sunrise', time: prayerTimes.Sunrise, icon: 'sunny' },
    { name: 'Ishraq', time: prayerTimes.Ishraq, icon: 'sunny-sharp' },
    { name: 'Chasht', time: prayerTimes.Chasht, icon: 'time-outline' },
  ];

  const currentPrayer = getCurrentPrayer(prayerTimes, currentTime);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color="white" />
          <Text style={styles.locationText}>Dhaka, Bangladesh</Text>
        </View>
        <Text style={styles.dateText}>
          {dayjs().format('dddd, MMMM D, YYYY')}
        </Text>
        <Text style={styles.timeText}>
          {dayjs(currentTime).format('h:mm:ss A')}
        </Text>
        
        <View style={styles.networkStatusContainer}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? '#2BCA9A' : '#D4AF37' }]} />
          <Text style={styles.networkStatus}>
            {isOnline ? 'Online' : 'Offline - Showing cached data'}
          </Text>
        </View>
        
        {currentPrayer && (
          <View style={styles.currentPrayerContainer}>
            <Text style={styles.currentPrayerLabel}>Current Prayer</Text>
            <View style={styles.currentPrayerContent}>
              <Ionicons 
                name={mandatoryPrayers.find(p => p.name === currentPrayer.name)?.icon || 'time'} 
                size={28} 
                color="white" 
              />
              <View style={styles.currentPrayerTextContainer}>
                <Text style={styles.currentPrayerName}>{currentPrayer.name}</Text>
                <Text style={styles.currentPrayerTime}>{currentPrayer.time}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Obligatory Prayers</Text>
          <View style={styles.prayerGrid}>
            {mandatoryPrayers.map((prayer, index) => (
              <View 
                key={index} 
                style={[
                  styles.prayerCard,
                  currentPrayer?.name === prayer.name && styles.currentPrayerCard
                ]}
              >
                <View style={styles.prayerIconContainer}>
                  <Ionicons 
                    name={prayer.icon} 
                    size={24} 
                    color={currentPrayer?.name === prayer.name ? '#1A5D1A' : '#555'} 
                  />
                </View>
                <Text style={[
                  styles.prayerName,
                  currentPrayer?.name === prayer.name && styles.currentPrayerNameText
                ]}>
                  {prayer.name}
                </Text>
                <Text style={[
                  styles.prayerTime,
                  currentPrayer?.name === prayer.name && styles.currentPrayerTimeText
                ]}>
                  {prayer.time}
                </Text>
                {currentPrayer?.name === prayer.name && (
                  <View style={styles.activeIndicator}>
                    <Text style={styles.activeText}>ACTIVE</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Prayers</Text>
          <View style={styles.prayerGrid}>
            {optionalPrayers.map((prayer, index) => (
              <View key={index} style={styles.prayerCard}>
                <View style={styles.prayerIconContainer}>
                  <Ionicons name={prayer.icon} size={24} color="#555" />
                </View>
                <Text style={styles.prayerName}>{prayer.name}</Text>
                <Text style={styles.prayerTime}>{prayer.time}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Calculation Method: University of Islamic Sciences, Karachi</Text>
        <Text style={styles.footerText}>Data provided by AlAdhan API</Text>
      </View>
    </ScrollView>
  );
}

function getCurrentPrayer(prayerTimes, currentTime) {
  if (!prayerTimes) return null;

  const prayers = [
    { name: 'Fajr', time: prayerTimes.Fajr },
    { name: 'Dhuhr', time: prayerTimes.Dhuhr },
    { name: 'Asr', time: prayerTimes.Asr },
    { name: 'Maghrib', time: prayerTimes.Maghrib },
    { name: 'Isha', time: prayerTimes.Isha },
  ];

  const current = new Date(currentTime);
  const currentHours = current.getHours();
  const currentMinutes = current.getMinutes();
  const currentTotal = currentHours * 60 + currentMinutes;

  let currentPrayer = null;

  for (let i = 0; i < prayers.length; i++) {
    const prayer = prayers[i];
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerTotal = hours * 60 + minutes;

    if (currentTotal < prayerTotal) {
      if (i === 0) {
        currentPrayer = prayers[prayers.length - 1];
      } else {
        currentPrayer = prayers[i - 1];
      }
      break;
    }
  }

  if (!currentPrayer) {
    currentPrayer = prayers[prayers.length - 1];
  }

  return currentPrayer;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: '#1A5D1A',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  dateText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  networkStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  networkStatus: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  currentPrayerContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  currentPrayerLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  currentPrayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentPrayerTextContainer: {
    marginLeft: 16,
    alignItems: 'center',
  },
  currentPrayerName: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  currentPrayerTime: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E384D',
    marginBottom: 16,
    paddingLeft: 8,
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  prayerCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  currentPrayerCard: {
    borderWidth: 2,
    borderColor: '#1A5D1A',
    backgroundColor: '#EDF5E8',
  },
  prayerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(26, 93, 26, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  currentPrayerNameText: {
    color: '#1A5D1A',
    fontWeight: '600',
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E384D',
  },
  currentPrayerTimeText: {
    color: '#1A5D1A',
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    padding: 16,
    paddingTop: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 18,
    color: '#D4AF37',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
  offlineText: {
    fontSize: 16,
    color: '#1A5D1A',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});