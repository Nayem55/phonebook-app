import { View, Text, TouchableOpacity, Linking, StyleSheet, Alert } from 'react-native';
import { FontAwesome, Entypo, MaterialIcons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';

export default function ContactCard({ person }) {
  const handleCall = () => {
    Linking.openURL(`tel:${person.personal_number}`);
  };

  const handleSave = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access contacts.');
      return;
    }
  
    // Build phone numbers array safely
    const phoneNumbers = [
      { number: person.personal_number, label: 'personal' }
    ];
  
    if (person.work_number) {
      phoneNumbers.push({ number: person.work_number, label: 'work' });
    }
  
    const contact = {
      [Contacts.Fields.FirstName]: person.name,
      [Contacts.Fields.PhoneNumbers]: phoneNumbers,
      [Contacts.Fields.Addresses]: [
        { street: person.address, label: 'home' },
      ],
    };
  
    try {
      await Contacts.addContactAsync(contact);
      Alert.alert('Contact Saved', `${person.name} has been added to your contacts.`);
    } catch (error) {
      console.error('Add contact error:', error);
      Alert.alert('Error', 'Failed to add contact.');
    }
  };
  

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{person.name}</Text>

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <Entypo name="location-pin" size={20} color="#ef4444" />
        </View>
        <Text style={styles.infoText}>{person.address}</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <FontAwesome name="phone" size={20} color="#22c55e" />
        </View>
        <Text style={styles.infoText}>{person.personal_number} (Personal)</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="work" size={20} color="#f59e0b" />
        </View>
        <Text style={styles.infoText}>{person.work_number || "Not Available"} (Work)</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.callButton]} onPress={handleCall}>
          <FontAwesome name="phone" size={16} color="white" />
          <Text style={styles.buttonText}> Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <FontAwesome name="save" size={16} color="white" />
          <Text style={styles.buttonText}> Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  iconContainer: {
    width: 26, // Ensures icons take same space
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    color: '#4b5563',
    fontSize: 15,
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
  },
  callButton: {
    backgroundColor: '#16a34a',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 15,
  },
});
