import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

const menuItems = [
  {
    id: 1,
    title: 'Contacts',
    icon: 'people-outline',
    route: '/phonebook',
    color: ['#4F6AF5', '#6A5DF9'],
  },
  {
    id: 2,
    title: 'Quran',
    icon: 'book-outline',
    route: '/quran',
    color: ['#FF7D54', '#FF5E62'],
  },
  {
    id: 3,
    title: 'Events',
    icon: 'calendar-outline',
    route: '/events',
    color: ['#2BCA9A', '#30D7A6'],
  },
  {
    id: 4,
    title: 'Notes',
    icon: 'document-text-outline',
    route: '/notes',
    color: ['#9B51E0', '#BB6BD9'],
  },
  {
    id: 5,
    title: 'Prayer Times',
    icon: 'time-outline',
    route: '/prayertimes',
    color: ['#56CCF2', '#2F80ED'],
  },
  {
    id: 6,
    title: 'Settings',
    icon: 'settings-outline',
    route: '/settings',
    color: ['#828282', '#A5A5A5'],
  },
];

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#2563eb', '#1d4ed8']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Assalamu Alaikum</Text>
            <Text style={styles.userName}>Obaid Sohail</Text>
            <Link href="/notifications" asChild>
              <TouchableOpacity style={styles.notificationIcon}>
                <Ionicons name="notifications-outline" size={24} color="white" />
              </TouchableOpacity>
            </Link>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <Link key={item.id} href={item.route} asChild>
              <TouchableOpacity style={styles.menuItem}>
                <LinearGradient
                  colors={item.color}
                  style={styles.menuIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={item.icon} size={28} color="white" />
                </LinearGradient>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.activities}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <Link href="/phonebook" asChild>
          <TouchableOpacity style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="people" size={20} color="#4F6AF5" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New Contact Added</Text>
              <Text style={styles.activityText}>Adnan Elahi joined the network</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/events" asChild>
          <TouchableOpacity style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="calendar" size={20} color="#FF7D54" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Upcoming Event</Text>
              <Text style={styles.activityText}>Monthly gathering tomorrow at 5 PM</Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const menuItemSize = width / 3 - 24;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F7FB',
    paddingBottom: 30,
  },
  header: {
    // height: 180,
    width: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  headerContent: {
    marginTop: 30,
  },
  greeting: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'sans-serif-light',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  notificationIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: menuItemSize,
    alignItems: 'center',
    marginBottom: 20,
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  activities: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 106, 245, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});