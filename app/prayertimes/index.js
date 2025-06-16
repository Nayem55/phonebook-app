import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function PrayerTimesScreen() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
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
        
        // Calculate Ishraq and Chasht times
        const sunrise = new Date(`${date.toDateString()} ${timings.Sunrise}`);
        const dhuhr = new Date(`${date.toDateString()} ${timings.Dhuhr}`);
        
        // Ishraq begins 15-20 minutes after sunrise
        const ishraqStart = new Date(sunrise.getTime() + 20 * 60000);
        
        // Chasht begins when Ishraq ends (about 45 minutes after sunrise)
        const chashtStart = new Date(ishraqStart.getTime() + 25 * 60000);
        
        // Chasht ends when the sun reaches its zenith (Dhuhr time)
        const chashtEnd = new Date(dhuhr.getTime());
        
        setPrayerTimes({
          ...timings,
          Ishraq: `${dayjs(ishraqStart).format('HH:mm')} - ${dayjs(chashtStart).format('HH:mm')}`,
          Chasht: `${dayjs(chashtStart).format('HH:mm')} - ${dayjs(chashtEnd).format('HH:mm')}`
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F6AF5" />
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
      <LinearGradient
        colors={['#1d4ed8', '#2563eb']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.locationText}>Dhaka, Bangladesh</Text>
        <Text style={styles.dateText}>
          {dayjs().format('dddd, MMMM D, YYYY')}
        </Text>
        <Text style={styles.timeText}>
          {dayjs(currentTime).format('h:mm:ss A')}
        </Text>
        
        {currentPrayer && (
          <View style={styles.currentPrayerContainer}>
            <Text style={styles.currentPrayerText}>Current: {currentPrayer.name}</Text>
            <Text style={styles.currentPrayerTime}>{currentPrayer.time}</Text>
          </View>
        )}
      </LinearGradient>

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

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recommended Prayers</Text>
        <View style={styles.prayerTimesContainer}>
          {optionalPrayers.map((prayer, index) => (
            <View 
              key={index} 
              style={styles.prayerCard}
            >
              <View style={styles.prayerIcon}>
                <Ionicons 
                  name={prayer.icon} 
                  size={28} 
                  color="#555" 
                />
              </View>
              <View style={styles.prayerInfo}>
                <Text style={styles.prayerName}>
                  {prayer.name}
                </Text>
                <Text style={styles.prayerTime}>
                  {prayer.time}
                </Text>
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
    backgroundColor: '#F5F7FB',
  },
  header: {
    padding: 25,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
    marginBottom: 20,
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
    marginLeft: 5,
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
    fontSize: 18,
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
    sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
    textAlign: 'center',
  },
  prayerTime: {
    fontSize: 16,
    color: '#333',
    marginTop: 3,
  },
});