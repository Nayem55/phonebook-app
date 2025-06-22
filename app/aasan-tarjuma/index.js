import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Pdf from 'react-native-pdf';
import { Asset } from "expo-asset";

const paraData = [
  { name: "introduction/مقدّمہ", page: 3 },
  { name: "الم (1)", page: 27 },
  { name: "سَيَقُولُ (2)", page: 93 },
  { name: "تِلْكَ الرُّسُلُ (3)", page: 152 },
  { name: "لَنْ تَنَالُوا (4)", page: 200 },
  { name: "وَالْمُحْصَنْتُ (5)", page: 250 },
  { name: "لَا يُحِبُّ الله (6)", page: 300 },
  { name: "وَإِذَا سَمِعُوا (7)", page: 354 },
  { name: "وَلَوْ أَنَّنَا (8)", page: 409 },
  { name: "قَالَ الْمَلَأُ (9)", page: 465 },
  { name: "وَاعْلَمُوا (10)", page: 528 },
  { name: "يَعْتَذِرُونَ (11)", page: 593 },
  { name: "وَمَا مِنْ دَابَّةٍ (12)", page: 659 },
  { name: "وَمَا أُبَرِّئُ (13)", page: 719 },
  { name: "ربما (14)", page: 790 },
  { name: "سُبْحَنَ الَّذِي (15)", page: 847 },
  { name: "قال الم (16)", page: 907 },
  { name: "اقْتَرَبَ (17)", page: 974 },
  { name: "قَدْ أَفْلَحَ (18)", page: 1030 },
  { name: "وَقَالَ الَّذِينَ (19)", page: 1091 },
  { name: "امَّنْ خَلَقَ (20)", page: 1151 },
  { name: "أتْلُ مَا أُوحِيَ (21)", page: 1203 },
  { name: "و من يقنت (22)", page: 1284 },
  { name: "وَمَا لِي (23)", page: 1346 },
  { name: "فَمَنْ أَظْلَمُ (24)", page: 1410 },
  { name: "إِلَيْهِ يُرَدُّ (25)", page: 1458 },
  { name: "حم (26)", page: 1520 },
  { name: "قَالَ فَمَا خَطْبُكُمْ (27)", page: 1598 },
  { name: "قَدْ سَمِعَ اللهُ (28)", page: 1678 },
  { name: "تَبْرَكَ الَّذِي (29)", page: 1762 },
  { name: "عَمَّ (30)", page: 1856 },
];

const surahData = [
  { name: "Al-Fatihah (1) الفاتحة", page: 27 },
  { name: "Al-Baqarah (2) البقرة", page: 31 },
  { name: "Al-Imran (3) آل عمران", page: 171 },
  { name: "An-Nisa (4) النساء", page: 238 },
  { name: "Al-Ma'idah (5) المائدة", page: 311 },
  { name: "Al-An'am (6) الأنعام", page: 371 },
  { name: "Al-A'raf (7) الأعراف", page: 433 },
  { name: "Al-Anfal (8) الأنفال", page: 509 },
  { name: "At-Taubah (9) التوبة", page: 547 },
  { name: "Yunus (10) يونس", page: 620 },
  { name: "Hud (11) هود", page: 658 },
  { name: "Yusuf (12) يوسف", page: 696 },
  { name: "Ar-Ra'd (13) الرعد", page: 742 },
  { name: "Ibrahim (14) إبراهيم", page: 768 },
  { name: "Al-Hijr (15) الحجر", page: 788 },
  { name: "An-Nahl (16) النحل", page: 806 },
  { name: "Bani Isra'il (17) الإسراء", page: 844 },
  { name: "Al-Kahf (18) الكهف", page: 880 },
  { name: "Maryam (19) مريم", page: 920 },
  { name: "Ta Ha (20) طه", page: 942 },
  { name: "Al-Anbiya (21) الأنبياء", page: 974 },
  { name: "Al-Hajj (22) الحج", page: 1002 },
  { name: "Al-Mu'minun (23) المؤمنون", page: 1030 },
  { name: "An-Nur (24) النور", page: 1052 },
  { name: "Al-Furqan (25) الفرقان", page: 1084 },
  { name: "Ash-Shu'ara (26) الشعراء", page: 1104 },
  { name: "An-Naml (27) النمل", page: 1134 },
  { name: "Al-Qasas (28) القصص", page: 1158 },
  { name: "Al-Ankabut (29) العنكبوت", page: 1190 },
  { name: "Ar-Rum (30) الروم", page: 1224 },
  { name: "Luqman (31) لقمان", page: 1244 },
  { name: "As-Sajdah (32) السجدة", page: 1258 },
  { name: "Al-Ahzab (33) الأحزاب", page: 1268 },
  { name: "Al-Saba (34) سبأ", page: 1304 },
  { name: "Al-Fatir (35) فاطر", page: 1324 },
  { name: "Ya Sin (36) يس", page: 1340 },
  { name: "As-Saffat (37) الصافات", page: 1358 },
  { name: "Sad (38) صٓ", page: 1380 },
  { name: "Az-Zumar (39) الزمر", page: 1400 },
  { name: "Al-Mu'min (40) المؤمن", page: 1422 },
  { name: "Ha Meem As-Sajdah (41) حم السجدہ", page: 1444 },
  { name: "Ash-Shura (42) الشورى", page: 1460 },
  { name: "Az-Zukhruf (43) الزخرف", page: 1476 },
  { name: "Ad-Dukhan (44) الدخان", page: 1498 },
  { name: "Al-Jathiyah (45) الجاثية", page: 1508 },
  { name: "Al-Ahqaf (46) الأحقاف", page: 1520 },
  { name: "Muhammad (47) محمد", page: 1536 },
  { name: "Al-Fath (48) الفتح", page: 1550 },
  { name: "Al-Hujurat (49) الحجرات", page: 1568 },
  { name: "Qaf (50) ق", page: 1580 },
  { name: "Ad-Dhariyat (51) الذاريات", page: 1592 },
  { name: "At-Tur (52) الطور", page: 1604 },
  { name: "An-Najm (53) النجم", page: 1616 },
  { name: "Al-Qamar (54) القمر", page: 1628 },
  { name: "Ar-Rahman (55) الرحمن", page: 1638 },
  { name: "Al-Waqi'ah (56) الواقعة", page: 1650 },
  { name: "Al-Hadid (57) الحديد", page: 1662 },
  { name: "Al-Mujadilah (58) المجادلة", page: 1678 },
  { name: "Al-Hashr (59) الحشر", page: 1690 },
  { name: "Al-Mumtahanah (60) الممتحنة", page: 1702 },
  { name: "As-Saff (61) الصف", page: 1714 },
  { name: "Al-Jumu'ah (62) الجمعة", page: 1722 },
  { name: "Al-Munafiqun (63) المنافقون", page: 1728 },
  { name: "At-Taghabun (64) التغابن", page: 1736 },
  { name: "At-Talaq (65) الطلاق", page: 1744 },
  { name: "At-Tahrim (66) التحريم", page: 1754 },
  { name: "Al-Mulk (67) الملك", page: 1762 },
  { name: "Al-Qalam (68) القلم", page: 1771 },
  { name: "Al-Haqqah (69) الحاقة", page: 1781 },
  { name: "Al-Ma'arij (70) المعارج", page: 1789 },
  { name: "Nuh (71) نوح", page: 1797 },
  { name: "Al-Jinn (72) الجن", page: 1804 },
  { name: "Al-Muzzammil (73) المزمل", page: 1814 },
  { name: "Al-Muddaththir (74) المدثر", page: 1822 },
  { name: "Al-Qiyamah (75) القيامة", page: 1833 },
  { name: "Ad-Dahr (76) الدَّهْرِ", page: 1840 },
  { name: "Al-Mursalat (77) المرسلات", page: 1848 },
  { name: "An-Naba (78) النبأ", page: 1856 },
  { name: "An-Nazi'at (79) النازعات", page: 1864 },
  { name: "Abasa (80) عبس", page: 1872 },
  { name: "At-Takwir (81) التكوير", page: 1879 },
  { name: "Al-Infitar (82) الانفطار", page: 1885 },
  { name: "Al-Mutaffifin (83) المطففين", page: 1889 },
  { name: "Al-Inshiqaq (84) الانشقاق", page: 1895 },
  { name: "Al-Buruj (85) البروج", page: 1900 },
  { name: "At-Tariq (86) الطارق", page: 1906 },
  { name: "Al-A'la (87) الأعلى", page: 1908 },
  { name: "Al-Ghashiyah (88) الغاشية", page: 1910 },
  { name: "Al-Fajr (89) الفجر", page: 1913 },
  { name: "Al-Balad (90) البلد", page: 1917 },
  { name: "Ash-Shams (91) الشمس", page: 1921 },
  { name: "Al-Lail (92) الليل", page: 1924 },
  { name: "Ad-Duha (93) الضحى", page: 1927 },
  { name: "Al-Inshirah (94) الشرح", page: 1929 },
  { name: "At-Tin (95) التين", page: 1931 },
  { name: "Al-Alaq (96) العلق", page: 1933 },
  { name: "Al-Qadr (97) القدر", page: 1936 },
  { name: "Al-Bayyinah (98) البينة", page: 1937 },
  { name: "Al-Zilzal (99) الزلزلة", page: 1939 },
  { name: "Al-Adiyat (100) العاديات", page: 1941 },
  { name: "Al-Qari'ah (101) القارعة", page: 1943 },
  { name: "At-Takathur (102) التكاثر", page: 1944 },
  { name: "Al-Asr (103) العصر", page: 1945 },
  { name: "Al-Humazah (104) الهمزة", page: 1946 },
  { name: "Al-Fil (105) الفيل", page: 1948 },
  { name: "Al-Quraish (106) قريش", page: 1950 },
  { name: "Al-Ma'un (107) الماعون", page: 1952 },
  { name: "Al-Kauthar (108) الكوثر", page: 1954 },
  { name: "Al-Kafirun (109) الكافرون", page: 1955 },
  { name: "An-Nasr (110) النصر", page: 1957 },
  { name: "Al-Lahab (111) المسد", page: 1959 },
  { name: "Al-Ikhlas (112) الإخلاص", page: 1961 },
  { name: "Al-Falaq (113) الفلق", page: 1963 },
  { name: "An-Nas (114) الناس", page: 1964 },
];


export default function AasanTarjumaScreen() {
  const [activeTab, setActiveTab] = useState("para");
  const [lastRead, setLastRead] = useState(null);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfSource, setPdfSource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const openPdfAtPage = async (item) => {
    try {
      setLastRead(item);
      
      // Get the PDF asset
      const asset = Asset.fromModule(require("../../assets/Aasan Tarjuma Quran.pdf"));
      
      // Download if not already available
      if (!asset.localUri) {
        await asset.downloadAsync();
      }
      
      // For iOS/Android, we'll use react-native-pdf
      setPdfSource({ uri: asset.localUri });
      setCurrentPage(item.page);
      setPdfVisible(true);
      
    } catch (error) {
      console.error("Error opening PDF:", error);
      alert("Error opening PDF. Please try again.");
    }
  };

  const sharePdf = async () => {
    try {
      if (pdfSource?.uri) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(pdfSource.uri);
        } else {
          alert("Sharing is not available on this device");
        }
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aasan Tarjuma Quran</Text>
      </View>

      {/* Last Read Section */}
      {lastRead && (
        <View style={styles.lastReadContainer}>
          <Text style={styles.sectionTitle}>Last Read</Text>
          <TouchableOpacity
            style={styles.lastReadCard}
            onPress={() => openPdfAtPage(lastRead)}
          >
            <Ionicons name="bookmark" size={20} color="#4F6AF5" />
            <View style={styles.lastReadContent}>
              <Text style={styles.lastReadName}>{lastRead.name}</Text>
              <Text style={styles.lastReadPage}>Page {lastRead.page}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "para" && styles.activeTab]}
          onPress={() => setActiveTab("para")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "para" && styles.activeTabText,
            ]}
          >
            Para
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "surah" && styles.activeTab]}
          onPress={() => setActiveTab("surah")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "surah" && styles.activeTabText,
            ]}
          >
            Surah
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === "para" ? (
          <>
            {paraData.map((para, index) => (
              <TouchableOpacity
                key={`para-${index}`}
                style={styles.itemCard}
                onPress={() => openPdfAtPage(para)}
              >
                <Text style={styles.itemName}>{para.name}</Text>
                <View style={styles.pageJumpContainer}>
                  <Text style={styles.pageNumber}>Page {para.page}</Text>
                  <Ionicons name="arrow-forward" size={18} color="#4F6AF5" />
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {surahData.map((surah, index) => (
              <TouchableOpacity
                key={`surah-${index}`}
                style={styles.itemCard}
                onPress={() => openPdfAtPage(surah)}
              >
                <Text style={styles.itemName}>{surah.name}</Text>
                <View style={styles.pageJumpContainer}>
                  <Text style={styles.pageNumber}>Page {surah.page}</Text>
                  <Ionicons name="arrow-forward" size={18} color="#4F6AF5" />
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* PDF Viewer Modal */}
      <Modal
        visible={pdfVisible}
        animationType="slide"
        onRequestClose={() => setPdfVisible(false)}
      >
        <View style={styles.pdfContainer}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity 
              onPress={() => setPdfVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={sharePdf}
              style={styles.shareButton}
            >
              <Ionicons name="share-social" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          {pdfSource && (
            <Pdf
              source={pdfSource}
              page={currentPage}
              style={styles.pdf}
              onError={(error) => {
                console.log(error);
                alert("Error loading PDF");
                setPdfVisible(false);
              }}
              onPageChanged={(page, numberOfPages) => {
                setCurrentPage(page);
              }}
              enablePaging={true}
              enableRTL={true}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#4F6AF5",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  lastReadContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  lastReadCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  lastReadContent: {
    marginLeft: 15,
    flex: 1,
  },
  lastReadName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  lastReadPage: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  pdfSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pdfSelectorText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#4F6AF5",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#4F6AF5",
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  itemCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  pageJumpContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageNumber: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
    pdfContainer: {
    flex: 1,
    backgroundColor: '#333',
  },
  pdfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4F6AF5',
  },
  closeButton: {
    padding: 5,
  },
  shareButton: {
    padding: 5,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
});
