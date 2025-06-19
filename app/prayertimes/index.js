import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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


  // Update current time every second
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

      // Try to get cached prayer times first
      const cachedPrayerTimes = await AsyncStorage.getItem('cachedPrayerTimes');
      if (cachedPrayerTimes) {
        setPrayerTimes(JSON.parse(cachedPrayerTimes));
      }

      if (networkState.isConnected && networkState.isInternetReachable) {
        const latitude = 23.8103; // Dhaka coordinates
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
        
        // Calculate Ishraq (15-20 mins after sunrise) and Chasht (until Dhuhr)
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
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading prayer times...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={50} color="#FF5E62" />
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
      {/* Header with solid color background */}
      <View style={styles.header}>
        <Text style={styles.locationText}>Dhaka, Bangladesh</Text>
        <Text style={styles.dateText}>
          {dayjs().format('dddd, MMMM D, YYYY')}
        </Text>
        <Text style={styles.timeText}>
          {dayjs(currentTime).format('h:mm:ss A')}
        </Text>
        <Text style={styles.networkStatus}>
          {isOnline ? 'Online' : 'Offline - Showing cached data'}
        </Text>
        
        {currentPrayer && (
          <View style={styles.currentPrayerContainer}>
            <Text style={styles.currentPrayerText}>Current: {currentPrayer.name}</Text>
            <Text style={styles.currentPrayerTime}>{currentPrayer.time}</Text>
          </View>
        )}
      </View>

      {/* Obligatory Prayers Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Obligatory Prayers</Text>
        <View style={styles.prayerTimesContainer}>
          {mandatoryPrayers.map((prayer, index) => (
            <View 
              key={index} 
              style={[
                styles.prayerCard,
                currentPrayer?.name === prayer.name && styles.currentPrayerCard
              ]}
            >
              <View style={styles.prayerIcon}>
                <Ionicons 
                  name={prayer.icon} 
                  size={28} 
                  color={currentPrayer?.name === prayer.name ? '#2563eb' : '#555'} 
                />
              </View>
              <View style={styles.prayerInfo}>
                <Text 
                  style={[
                    styles.prayerName,
                    currentPrayer?.name === prayer.name && styles.currentPrayerName
                  ]}
                >
                  {prayer.name}
                </Text>
                <Text 
                  style={[
                    styles.prayerTime,
                    currentPrayer?.name === prayer.name && styles.currentPrayerTimeText
                  ]}
                >
                  {prayer.time}
                </Text>
              </View>
              {currentPrayer?.name === prayer.name && (
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Recommended Prayers Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recommended Prayers</Text>
        <View style={styles.prayerTimesContainer}>
          {optionalPrayers.map((prayer, index) => (
            <View key={index} style={styles.prayerCard}>
              <View style={styles.prayerIcon}>
                <Ionicons name={prayer.icon} size={28} color="#555" />
              </View>
              <View style={styles.prayerInfo}>
                <Text style={styles.prayerName}>{prayer.name}</Text>
                <Text style={styles.prayerTime}>{prayer.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Calculation Method: University of Islamic Sciences, Karachi</Text>
        <Text style={styles.footerText}>Data provided by AlAdhan API</Text>
      </View>
    </ScrollView>
  );
}

// Helper function to determine current prayer
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
        currentPrayer = prayers[prayers.length - 1]; // Isha from previous day
      } else {
        currentPrayer = prayers[i - 1];
      }
      break;
    }
  }

  if (!currentPrayer) {
    currentPrayer = prayers[prayers.length - 1]; // Default to Isha
  }

  return currentPrayer;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    padding: 25,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: '#2563eb',
  },
  locationText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 15,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  networkStatus: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  currentPrayerContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  currentPrayerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  currentPrayerTime: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  prayerTimesContainer: {
    marginBottom: 10,
  },
  prayerCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentPrayerCard: {
    borderWidth: 2,
    borderColor: '#2563eb',
    backgroundColor: '#F0F5FF',
  },
  prayerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(79, 106, 245, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  currentPrayerName: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  prayerTime: {
    fontSize: 16,
    color: '#333',
    marginTop: 3,
  },
  currentPrayerTimeText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5E62',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 5,
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F5F7FB',
  },
  errorText: {
    fontSize: 18,
    color: '#FF5E62',
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
    textAlign: 'center',
  },
  offlineText: {
    fontSize: 16,
    color: '#2563eb',
    marginTop: 20,
    textAlign: 'center',
  },
});