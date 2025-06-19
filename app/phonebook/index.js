import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button
} from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import ContactCard from "../../components/ContactCard";
import * as Network from "expo-network";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Phonebook() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  // Fetch contacts from API or cache
  const fetchContacts = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsOnline(networkState.isConnected && networkState.isInternetReachable);

      // Try to get cached contacts first
      const cachedContacts = await AsyncStorage.getItem("cachedContacts");
      if (cachedContacts) {
        setContacts(JSON.parse(cachedContacts));
      }

      if (networkState.isConnected && networkState.isInternetReachable) {
        // Fetch from API if online
        const response = await fetch(
          "https://phonebook-server-black.vercel.app/contacts"
        );
        const apiContacts = await response.json();

        // Transform API response to match expected format
        const formattedContacts = apiContacts.map((contact) => ({
          name: contact.name,
          address: contact.address,
          personal_number: contact.personal_number,
          work_number: contact.work_number,
        }));

        // Update state and cache
        setContacts(formattedContacts);
        await AsyncStorage.setItem(
          "cachedContacts",
          JSON.stringify(formattedContacts)
        );
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check network status periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsOnline(networkState.isConnected && networkState.isInternetReachable);

      if (networkState.isConnected && networkState.isInternetReachable) {
        fetchContacts(); // Auto-refresh when coming online
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Initial load
  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts
    .filter((contact) =>
      contact?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F6AF5" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <View style={styles.headerRight}>
          <Link href="/" asChild>
            <Text style={styles.backButton}>Back</Text>
          </Link>
        </View>
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
  );
}

// ... (keep your existing styles)

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f8ff",
    paddingBottom: 32,
    minHeight: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2563eb",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    color: "white",
    fontSize: 16,
  },
  networkStatus: {
    color: "white",
    fontSize: 14,
    fontStyle: "italic",
  },
  searchWrapper: {
    marginTop: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
});
