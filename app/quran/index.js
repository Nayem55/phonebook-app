import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const resources = [
  {
    id: 1,
    title: 'Munajaat e Maqbool',
    icon: 'book-outline',
    route: '/munajaat',
    color: '#4F6AF5',
  },
  {
    id: 2,
    title: '99 Names of Allah',
    icon: 'sparkles-outline',
    route: '/names-of-allah',
    color: '#FF7D54',
  },
  {
    id: 3,
    title: 'Aasan Tarjuma Quran',
    icon: 'language-outline',
    route: '/aasan-tarjuma',
    color: '#2BCA9A',
  },
  {
    id: 4,
    title: 'Bahishti Zewar',
    icon: 'ribbon-outline',
    route: '/bahishti-zewar',
    color: '#9B51E0',
  },
  {
    id: 5,
    title: 'Hafezi Quran',
    icon: 'school-outline',
    route: '/hifz-quran',
    color: '#56CCF2',
  },
  {
    id: 6,
    title: 'Heavenly Ornaments',
    icon: 'diamond-outline',
    route: '/heavenly-ornaments',
    color: '#FF5E62',
  },
  {
    id: 7,
    title: 'The Noble Quran',
    icon: 'bookmarks-outline',
    route: '/noble-quran',
    color: '#6A5DF9',
  },
];

export default function QuranScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quran & Dua Resources</Text>
        <Text style={styles.headerSubtitle}>Islamic learning materials</Text>
      </View>

      <View style={styles.resourcesGrid}>
        {resources.map((resource) => (
          <Link key={resource.id} href={resource.route} asChild>
            <TouchableOpacity style={styles.resourceItem}>
              <View style={[styles.resourceIconContainer, { backgroundColor: resource.color }]}>
                <Ionicons name={resource.icon} size={28} color="white" />
              </View>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Dua</Text>
        <View style={styles.duaCard}>
          <Text style={styles.duaArabic}>رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ</Text>
          <Text style={styles.duaTranslation}>"Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire."</Text>
          <Text style={styles.duaReference}>[Surah Al-Baqarah 2:201]</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const itemSize = width / 3 - 24;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F7FB',
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  resourceItem: {
    width: itemSize,
    alignItems: 'center',
    marginBottom: 20,
  },
  resourceIconContainer: {
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
  resourceTitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  duaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  duaArabic: {
    fontSize: 20,
    color: '#2E384D',
    textAlign: 'right',
    lineHeight: 32,
    marginBottom: 15,
    fontFamily: 'TraditionalArabic', // Make sure to load this font in your app
  },
  duaTranslation: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    lineHeight: 24,
  },
  duaReference: {
    fontSize: 14,
    color: '#4F6AF5',
    fontStyle: 'italic',
  },
});