import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useState, useRef } from "react";
import ContactCard from "../components/ContactCard";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

const dummyContacts = [
  {
    name: "Obaid Sohail",
    address: "Najeeb Villa,Nazimuddin Road",
    personal_number: "01671028264",
  },
  {
    name: "Sohail Akhtar",
    address: "Najeeb Villa,Nazimuddin Road",
    personal_number: "01711526961",
    work_number: "01611526961",
  },
  {
    name: "Imran Sultan",
    address: "Green Garden Tower,Green Road",
    personal_number: "01713089600",
  },
  {
    name: "Adan Kashif",
    address: "Prince Tower,Elephant Road",
    personal_number: "01797244664",
  },
  {
    name: "Adeel ur Rahman",
    address: "Karim Tower,Amligola",
    personal_number: "01715459267",
    work_number: "01937311814",
  },
  {
    name: "Adil Hussain",
    address: "Dhanmondi 3",
    personal_number: "01747910847",
  },
  {
    name: "Adnan Elahi",
    address: "Zakir Villa,Jigatola",
    personal_number: "01677535662",
  },
  {
    name: "Ahsan Nadim",
    address: "Chankharpul",
    personal_number: "01748446697",
  },
  {
    name: "Ammar Mumtaz",
    address: "Dhanmondi 5",
    personal_number: "01759987586",
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

export default function Phonebook() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationAnim = useRef(new Animated.Value(0)).current;

  const toggleNotifications = () => {
    if (showNotifications) {
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => setShowNotifications(false));
    } else {
      setShowNotifications(true);
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  };

  const slideTranslate = notificationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const filteredContacts = dummyContacts
    .filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={{ flex: 1 }}>
      {showNotifications && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleNotifications}
        />
      )}

      {showNotifications && (
        <Animated.View
          style={[
            styles.notificationPanel,
            { transform: [{ translateY: slideTranslate }] },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.panelTitle}>🔔 Notifications</Text>
            {notifications.map((note, index) => (
              <View key={index} style={styles.notificationCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{note.title}</Text>
                  <Text style={styles.cardAuthor}>by {note.author}</Text>
                </View>
                <Text style={styles.cardBody}>{note.body}</Text>
                <Text style={styles.cardDate}>
                  {dayjs(note.publishedAt).format("MMM D, YYYY • h:mm A")}
                </Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>📒 LinkBook</Text>
            <TouchableOpacity onPress={toggleNotifications}>
              <Ionicons name="notifications-outline" size={26} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>One Hub for All Your People</Text>
        </View>

        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.cardContainer}>
          {filteredContacts.map((person, index) => (
            <ContactCard key={index} person={person} />
          ))}
          {filteredContacts.length === 0 && (
            <Text style={styles.noResults}>No contacts found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f8ff",
    paddingBottom: 32,
    minHeight: "100%",
  },
  header: {
    backgroundColor: "#2563eb",
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: "relative",
    zIndex: 1,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 4,
    marginLeft: 10,
    marginBottom: 10,
  },
  searchWrapper: {
    marginTop: -20,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  searchInput: {
    fontSize: 16,
    color: "#333",
  },
  cardContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  noResults: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#555",
  },
  notificationPanel: {
    position: "absolute",
    top: 110,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1000,
    height: Dimensions.get("window").height - 110,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1e3a8a",
  },
  notificationCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  cardAuthor: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  cardBody: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    marginTop: 2,
  },
  cardDate: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "right",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999,
  },
});
