import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const resources = [
  {
    id: 1,
    title: "Munajaat e Maqbool",
    icon: "book-outline",
    route: "/munajaat",
    color: "#1A5D1A", // Deep green
  },
  {
    id: 2,
    title: "99 Names of Allah",
    icon: "sparkles-outline",
    route: "/names-of-allah",
    color: "#D4AF37", // Gold
  },
  {
    id: 3,
    title: "Aasan Tarjuma Quran",
    icon: "language-outline",
    route: "/aasan-tarjuma",
    color: "#0A7E8C", // Teal
  },
  {
    id: 4,
    title: "Bahishti Zewar",
    icon: "ribbon-outline",
    route: "/bahishti-zewar",
    color: "#6A1B9A", // Purple
  },
  {
    id: 5,
    title: "Hafezi Quran",
    icon: "school-outline",
    route: "/hifz-quran",
    color: "#0288D1", // Blue
  },
  {
    id: 6,
    title: "Heavenly Ornaments",
    icon: "diamond-outline",
    route: "/heavenly-ornaments",
    color: "#C2185B", // Pink
  },
  {
    id: 7,
    title: "The Noble Quran",
    icon: "bookmarks-outline",
    route: "/noble-quran",
    color: "#1A5D1A", // Deep green
  },
];

export default function QuranScreen() {
  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Link
            href="/"
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Link>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Quran & Dua Resources</Text>
            <Text style={styles.headerSubtitle}>
              Islamic learning materials
            </Text>
          </View>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Resources Grid */}
        <View style={styles.gridContainer}>
          {resources.map((resource) => (
            <Link key={resource.id} href={resource.route} asChild>
              <TouchableOpacity style={styles.resourceCard}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: resource.color },
                  ]}
                >
                  <Ionicons name={resource.icon} size={24} color="white" />
                </View>
                <Text style={styles.cardTitle}>{resource.title}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        {/* Dua Section */}
        <View style={styles.duaSection}>
          <Text style={styles.sectionTitle}>Daily Dua</Text>
          <View style={styles.duaCard}>
            <Text style={styles.arabicText}>
              رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً
              وَقِنَا عَذَابَ النَّارِ
            </Text>
            <View style={styles.divider} />
            <Text style={styles.translation}>
              "Our Lord, give us in this world [that which is] good and in the
              Hereafter [that which is] good and protect us from the punishment
              of the Fire."
            </Text>
            <Text style={styles.reference}>[Surah Al-Baqarah 2:201]</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    backgroundColor: "#1A5D1A",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
      default: {
        elevation: 3,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  headerRightPlaceholder: {
    width: 40, // Balances the back button space
  },
  scrollContent: {
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  resourceCard: {
    width: CARD_WIDTH,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      },
      default: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  duaSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  duaCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      web: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      },
      default: {
        elevation: 2,
      },
    }),
  },
  arabicText: {
    fontSize: 20,
    color: "#2E384D",
    textAlign: "right",
    lineHeight: 32,
    fontFamily: "TraditionalArabic",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  translation: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 8,
  },
  reference: {
    fontSize: 14,
    color: "#1A5D1A",
    fontStyle: "italic",
    textAlign: "right",
  },
});
