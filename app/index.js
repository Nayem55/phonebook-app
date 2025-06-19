import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState, useRef } from 'react';
import dayjs from 'dayjs';

const menuItems = [
  {
    id: 1,
    title: 'Contacts',
    icon: 'people-outline',
    route: '/phonebook',
    color: '#4F6AF5',
  },
  {
    id: 2,
    title: 'Quran',
    icon: 'book-outline',
    route: '/quran',
    color: '#FF7D54',
  },
  {
    id: 3,
    title: 'Events',
    icon: 'calendar-outline',
    route: '/events',
    color: '#2BCA9A',
  },
  {
    id: 4,
    title: 'Notes',
    icon: 'document-text-outline',
    route: '/notes',
    color: '#9B51E0',
  },
  {
    id: 5,
    title: 'Prayer Times',
    icon: 'time-outline',
    route: '/prayertimes',
    color: '#56CCF2',
  },
  {
    id: 6,
    title: 'Settings',
    icon: 'settings-outline',
    route: '/settings',
    color: '#828282',
  },
];

const notifications = [
  {
    author: "Admin",
    title: "Team Meeting",
    body: "There will be a team meeting at 5 PM in the conference room.",
    publishedAt: "2025-04-20T14:00:00",
  },
  {
    author: "System",
    title: "Contact Sync Available",
    body: "A new sync is available to update your phonebook.",
    publishedAt: "2025-04-19T09:30:00",
  },
  {
    author: "Admin",
    title: "Birthday Reminder",
    body: "Today is Adnan Elahi's birthday. Don't forget to wish him!",
    publishedAt: "2025-04-20T08:00:00",
  },
  {
    author: "Admin",
    title: "Team Meeting",
    body: "There will be a team meeting at 5 PM in the conference room.",
    publishedAt: "2025-04-20T14:00:00",
  },
  {
    author: "System",
    title: "Contact Sync Available",
    body: "A new sync is available to update your phonebook.",
    publishedAt: "2025-04-19T09:30:00",
  },
  {
    author: "Admin",
    title: "Birthday Reminder",
    body: "Today is Adnan Elahi's birthday. Don't forget to wish him!",
    publishedAt: "2025-04-20T08:00:00",
  },
];

export default function HomeScreen() {
  const [showNotifications, setShowNotifications] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleNotifications = () => {
    if (showNotifications) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setShowNotifications(false));
    } else {
      setShowNotifications(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height, 0],
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={[styles.gradient, { backgroundColor: '#2563eb' }]}>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>Assalamu Alaikum</Text>
              <Text style={styles.userName}>Obaid Sohail</Text>
              <TouchableOpacity 
                style={styles.notificationIcon}
                onPress={toggleNotifications}
              >
                <Ionicons name="notifications-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <Link key={item.id} href={item.route} asChild>
                <TouchableOpacity style={styles.menuItem}>
                  <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} size={28} color="white" />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>

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

      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="none"
        onRequestClose={toggleNotifications}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleNotifications}
        >
          <Animated.View 
            style={[
              styles.notificationContainer,
              { transform: [{ translateY }] }
            ]}
          >
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>Notifications</Text>
              <TouchableOpacity onPress={toggleNotifications}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.notificationScroll}>
              {notifications.map((notification, index) => (
                <View key={index} style={styles.notificationItem}>
                  <View style={styles.notificationIconContainer}>
                    <Ionicons 
                      name={notification.author === "Admin" ? "person" : "notifications"} 
                      size={20} 
                      color="#4F6AF5" 
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationItemTitle}>{notification.title}</Text>
                    <Text style={styles.notificationItemBody}>{notification.body}</Text>
                    <Text style={styles.notificationItemTime}>
                      {dayjs(notification.publishedAt).format('MMM D, YYYY • h:mm A')}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  notificationContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationScroll: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 106, 245, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationItemBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationItemTime: {
    fontSize: 12,
    color: '#999',
  },
});

//eas build --platform android
//eas build --platform android --profile preview
