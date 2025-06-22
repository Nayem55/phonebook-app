import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  Easing,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState, useRef } from "react";
import dayjs from "dayjs";

const menuItems = [
  {
    id: 1,
    title: "Contacts",
    icon: "people-outline",
    route: "/phonebook",
    color: "#1A5D1A",
  },
  {
    id: 2,
    title: "Quran",
    icon: "book-outline",
    route: "/quran",
    color: "#D4AF37",
  },
  {
    id: 3,
    title: "Events",
    icon: "calendar-outline",
    route: "/events",
    color: "#0A7E8C",
  },
  {
    id: 4,
    title: "Notes",
    icon: "document-text-outline",
    route: "/notes",
    color: "#6A1B9A",
  },
  {
    id: 5,
    title: "Prayer Times",
    icon: "time-outline",
    route: "/prayertimes",
    color: "#0288D1",
  },
  {
    id: 6,
    title: "Settings",
    icon: "settings-outline",
    route: "/settings",
    color: "#555",
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
    outputRange: [Dimensions.get("window").height, 0],
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Assalamu Alaikum</Text>
            <Text style={styles.userName}>Shamsi Welfare Society Dhaka</Text>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.dateText}>{dayjs().format("dddd, MMMM D")}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={toggleNotifications}
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
          </View>
          
          <View style={styles.gridContainer}>
            {menuItems.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <Link href={item.route} asChild>
                  <TouchableOpacity style={styles.menuItem}>
                    <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                      <Ionicons name={item.icon} size={24} color="white" />
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
          </View>
          
          <View style={styles.activitiesContainer}>
            <Link href="/phonebook" asChild>
              <TouchableOpacity style={styles.activityCard}>
                <View style={[styles.activityIcon, { backgroundColor: "rgba(26, 93, 26, 0.1)" }]}>
                  <Ionicons name="people" size={20} color="#1A5D1A" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>New Contact Added</Text>
                  <Text style={styles.activityText}>Adnan Elahi joined the network</Text>
                  <View style={styles.activityFooter}>
                    <Ionicons name="time-outline" size={14} color="#888" />
                    <Text style={styles.activityTime}>2 hours ago</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>

            <Link href="/events" asChild>
              <TouchableOpacity style={styles.activityCard}>
                <View style={[styles.activityIcon, { backgroundColor: "rgba(212, 175, 55, 0.1)" }]}>
                  <Ionicons name="calendar" size={20} color="#D4AF37" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Upcoming Event</Text>
                  <Text style={styles.activityText}>Monthly gathering tomorrow at 5 PM</Text>
                  <View style={styles.activityFooter}>
                    <Ionicons name="time-outline" size={14} color="#888" />
                    <Text style={styles.activityTime}>Yesterday</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          </View>
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
            style={[styles.notificationPanel, { transform: [{ translateY }] }]}
          >
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>Notifications</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleNotifications}
              >
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.notificationList}
              showsVerticalScrollIndicator={false}
            >
              {notifications.map((notification, index) => (
                <View key={index} style={styles.notificationItem}>
                  <View
                    style={[
                      styles.notificationIcon,
                      {
                        backgroundColor:
                          notification.author === "Admin"
                            ? "rgba(26, 93, 26, 0.1)"
                            : "rgba(10, 126, 140, 0.1)",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        notification.author === "Admin"
                          ? "person"
                          : "notifications"
                      }
                      size={20}
                      color={
                        notification.author === "Admin" ? "#1A5D1A" : "#0A7E8C"
                      }
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationItemTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationItemBody}>
                      {notification.body}
                    </Text>
                    <View style={styles.notificationTime}>
                      <Ionicons name="time-outline" size={12} color="#888" />
                      <Text style={styles.notificationTimeText}>
                        {dayjs(notification.publishedAt).format(
                          "MMM D, YYYY • h:mm A"
                        )}
                      </Text>
                    </View>
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

const { width } = Dimensions.get("window");
const itemMargin = 12;
const itemWidth = (width - (itemMargin * 3)) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: "#1A5D1A",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginLeft: 6,
  },
  notificationButton: {
    position: "absolute",
    right: 24,
    top: Platform.OS === "ios" ? 50 : 30,
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#D4AF37",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2E384D",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: itemWidth,
    marginBottom: itemMargin,
  },
  menuItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      },
      default: {
        elevation: 2,
      },
    }),
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2E384D",
    textAlign: "center",
  },
  activitiesContainer: {
    marginTop: 8,
  },
  activityCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      },
      default: {
        elevation: 1,
      },
    }),
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E384D",
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  activityFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityTime: {
    fontSize: 12,
    color: "#888",
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  notificationPanel: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: Dimensions.get("window").height * 0.7,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E384D",
  },
  closeButton: {
    padding: 4,
  },
  notificationList: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E384D",
    marginBottom: 4,
  },
  notificationItemBody: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationTimeText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 4,
  },
});