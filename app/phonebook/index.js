import { ScrollView, Text, View, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import ContactCard from "../../components/ContactCard";

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
  {
    name: "Arif Wasey",
    personal_number: "01711540657",
  },
  {
    name: "Asad Iqbal",
    address: "Motalib Plaza,Paribagh",
    personal_number: "01748264517",
  },
  {
    name: "Asim Elahi",
    address: "Dhanmondi 26",
    personal_number: "01715658582",
  },
  {
    name: "Bashir Aslam",
    address: "Lalbagh",
    personal_number: "01675305527",
    work_number: "01975305527",
  },
  {
    name: "Talha Jamal",
    address: "Najeeb Villa,Nazimuddin Road",
    personal_number: "01715550702",
  },
  {
    name: "Bilal Elahi",
    address: "Dhanmondi 26",
    personal_number: "01686887399",
  },
  {
    name: "Faisal Anis",
    address: "Green Garden Tower,Green Road",
    personal_number: "01730037125",
    work_number: "01860947747",
  },
  {
    name: "Daniyal Shamsi",
    address: "Zakir Villa,Jigatola",
    personal_number: "01681275616",
  },
  {
    name: "Daud Afroz",
    address: "Karim Tower,Amligola",
    personal_number: "01788419672",
  },
  {
    name: "Ebadullah Ahmed",
    address: "Dhanmondi 1",
    personal_number: "01672796741",
  },
  {
    name: "Fahim Elahi",
    address: "Dhanmondi 26",
    personal_number: "01911311986",
  },
  {
    name: "Faisal Aman",
    address: "Dhanmondi 3",
    personal_number: "01711526792",
  },
  {
    name: "Faisal Zakir",
    address: "Zakir Villa,Jigatola",
    personal_number: "01672742476",
  },
  {
    name: "Faiyaz Aftab",
    address: "Paribagh",
    personal_number: "01670253960",
  },
  {
    name: "Faizeen Ahmed",
    address: "Green Garden Tower,Green Road",
    personal_number: "01703438151",
  },
  {
    name: "Faraz Sultan",
    address: "Green Garden Tower,Green Road",
    personal_number: "01713007241",
  },
  {
    name: "Farhan Ahmed",
    address: "Dhanmondi 5",
    personal_number: "01755502065",
  },
  {
    name: "Farrukh Qamar",
    address: "Dhanmondi 1",
    personal_number: "01715102996",
    work_number: "01615102996",
  },
  {
    name: "Fawad Atir",
    address: "Dhanmondi 5",
    personal_number: "01917716382",
  },
  {
    name: "Fazal Ahmed",
    personal_number: "01982763867",
  },
  {
    name: "Furqan Javed",
    address: "Haseeb Villa,Amligola",
    personal_number: "01725553884",
  },
  {
    name: "Hadi Faisal",
    address: "Zakir Villa,Jigatola",
    personal_number: "01624974211",
  },
  {
    name: "Haider Jami",
    address: "Yaseen Apartment,Nawabganj",
    personal_number: "01911495865",
  },
  {
    name: "Hamza Iqbal",
    address: "Jigatola",
    personal_number: "01619397300",
  },
  {
    name: "Haris Elahi",
    address: "Dhanmondi 1",
    personal_number: "01713081204",
  },
  {
    name: "Jawad Atir",
    address: "Dhanmondi 5",
    personal_number: "01826083063",
  },
  {
    name: "Jawad Iqtedar",
    address: "Green Garden Tower,Green Road",
    personal_number: "01711170667",
  },
  {
    name: "Jawad ul Haque",
    address: "Dhanmondi 1",
    personal_number: "01819212200",
  },
  {
    name: "Junaid Salim",
    address: "Eastern Tower",
    personal_number: "01777444463",
    work_number: "01671350235",
  },
  {
    name: "Khalil Kalim",
    address: "Karim Tower,Board office",
    personal_number: "01784202300",
  },
  {
    name: "Khateeb Irshad",
    address: "Lalbagh",
    personal_number: "01670085782",
  },
  {
    name: "Khateeb ur Rahman",
    address: "Dhanmondi 5",
    personal_number: "01713458679",
  },
  {
    name: "Khuzaima Khizer",
    address: "Prince Tower,Elephant Road",
    personal_number: "01781365655",
  },
  {
    name: "Maaz Haque",
    address: "Atishkhana,Lalbagh",
    personal_number: "01746369670",
    work_number: "01938102707",
  },
  {
    name: "Masab Farooqui",
    address: "Mohammadpur",
    personal_number: "01911367654",
    work_number: "01611367654",
  },
  {
    name: "Muzaffar Sultan (Humayun)",
    address: "Green Garden Tower,Green Road",
    personal_number: "01713089666",
  },
  {
    name: "Moiz Iqbal Najmi",
    address: "Motalib Plaza,Paribagh",
    personal_number: "01674058478",
  },
  {
    name: "Monis Ahmed",
    address: "Dhanmondi 5",
    personal_number: "01751177547",
  },
  {
    name: "Mubashir Iqbal",
    address: "Motalib Plaza,Paribagh",
    personal_number: "01838215487",
  },
  {
    name: "Mubashir Suroor",
    address: "Zakir Villa,Jigatola",
    personal_number: "01673085995",
    work_number: "01958140794",
  },
  {
    name: "Mubashir Tariq",
    address: "Green Road",
    personal_number: "01746057657",
  },
  {
    name: "Munib Waqar",
    address: "Prince Tower,Elephant Road",
    personal_number: "01780006302",
  },
  {
    name: "Munib Naved",
    address: "Paribagh",
    personal_number: "01917708977",
  },
  {
    name: "Mustaqim Ahmed",
    address: "Karim Tower,Amligola",
    personal_number: "01720039257",
    work_number: "01914117532",
  },
  {
    name: "Muzaffar Sultan (Sonic)",
    address: "Dhanmondi 5",
    personal_number: "01817619613",
  },
  {
    name: "Muzammil Iqbal",
    address: "Motalib Plaza,Paribagh",
    personal_number: "01945007000",
  },
  {
    name: "Nabeel Iqbal",
    address: "Jigatola",
    personal_number: "01673142354",
  },
  {
    name: "Zafar Iqbal Najmi",
    address: "Motalib Plaza,Paribagh",
    personal_number: "01922800134",
  },
  {
    name: "Nasir Sharif",
    address: "Karim Tower,Amligola",
    personal_number: "01913208800",
  },
  {
    name: "Nayeem Asad",
    address: "Zakir Villa,Jigatola",
    personal_number: "01714301062",
  },
  {
    name: "Obaid Elahi",
    address: "Shankar",
    personal_number: "01817079107",
  },
  {
    name: "Omar Elahi",
    address: "Dhanmondi 1",
    personal_number: "01673026199",
  },
  {
    name: "Obaidullah Uwais",
    address: "Dhanmondi 1",
    personal_number: "01645031822",
  },
  {
    name: "Omaer Kamal",
    address: "Dhanmondi 5",
    personal_number: "01708521489",
    work_number: "01817068113",
  },
  {
    name: "Osama Shahab",
    address: "Fakirchand Lalbagh",
    personal_number: "01779285825",
  },
  {
    name: "Osama Khalid",
    address: "Green Road",
    personal_number: "01971964189",
  },
  {
    name: "Osman Raees",
    address: "Lalbagh",
    personal_number: "01680165260",
  },
  {
    name: "Ozair Atir",
    address: "Dhanmondi 5",
    personal_number: "01867805033",
    work_number: "01314661808",
  },
  {
    name: "Ozair Anjum",
    address: "Dhanmondi 1",
    personal_number: "01319935940",
  },
  {
    name: "Rabi ul Islam",
    address: "Karim Tower,Amligola",
    personal_number: "01924781509",
  },
  {
    name: "Rafiq Elahi",
    address: "Dhanmondi 1",
    personal_number: "01789035525",
    work_number: "01946758301",
  },
  {
    name: "Saad Ahmed",
    address: "Zakir Villa,Jigatola",
    personal_number: "01622038481",
    work_number: "01776495869",
  },
  {
    name: "Saad Ahmed Farid",
    address: "Dhanmondi 1",
    personal_number: "01675447744",
  },
  {
    name: "Saad Anjum",
    address: "Board Office",
    personal_number: "01799914764",
  },
  {
    name: "Saad Elahi",
    address: "Zakir Villa,Jigatola",
    personal_number: "01715702275",
  },
  {
    name: "Saad Farrukh",
    address: "Dhanmondi 1",
    personal_number: "01622808992",
  },
  {
    name: "Safdar Rahman",
    address: "Paribagh",
    personal_number: "01977290467",
  },
  {
    name: "Saif Irshad",
    address: "Yaseen Apartment,Nawabganj",
    personal_number: "01674040955",
  },
  {
    name: "Salik Saudagar",
    address: "Dhanmondi 3",
    personal_number: "01755509001",
  },
  {
    name: "Salim Hussain",
    address: "Dhanmondi 3",
    personal_number: "01316345558",
  },
  {
    name: "Salman Zakir",
    address: "Zakir Villa,Jigatola",
    personal_number: "01917714269",
  },
  {
    name: "Sanan Aman",
    address: "Dhanmondi 1",
    personal_number: "01907161056",
  },
  {
    name: "Saqib Usman",
    address: "Fakirchand Lalbagh",
    personal_number: "01715175413",
  },
  {
    name: "Saud Ahmed",
    address: "Dhanmondi 1",
    personal_number: "01675466089",
  },
  {
    name: "Saud Qamar",
    address: "Dhanmondi 5",
    personal_number: "01626594154",
  },
  {
    name: "Shaheen Akhtar",
    address: "Green Road",
    personal_number: "01715107818",
  },
  {
    name: "Shakeeb ur Rahman",
    address: "Dhanmondi 5",
    personal_number: "01713019131",
  },
  {
    name: "Sharib Nadim",
    address: "Mohammadpur",
    personal_number: "01916100018",
  },
  {
    name: "Sharib Rahman",
    address: "Haseeb Villa,Amligola",
    personal_number: "01672838449",
  },
  {
    name: "Shayaan Tauseef",
    address: "Najeeb Villa,Nazimuddin Road",
    personal_number: "01782554074",
    work_number: "01834813151",
  },
  {
    name: "Shaiban Shamsi",
    address: "Haseeb Villa,Amligola",
    personal_number: "01980103032",
  },
  {
    name: "Shoaib Feroz",
    address: "Green Road",
    personal_number: "01610829505",
    work_number: "01920300018",
  },
  {
    name: "Siddiq Elahi",
    address: "Dhanmondi 1",
    personal_number: "01713122445",
  },
  {
    name: "Soheb Javed",
    address: "Dhanmondi 5",
    personal_number: "01713032433",
  },
  {
    name: "Solaiman Shamim",
    address: "Jigatola",
    personal_number: "01784651759",
    work_number: "01946659290",
  },
  {
    name: "Bilal Ahmed (Sunny)",
    address: "Dhanmondi 5a",
    personal_number: "01918662020",
  },
  {
    name: "Tahur Adnan",
    address: "Fakirchand Lalbagh",
    personal_number: "01766591832",
  },
  {
    name: "Taiyab Mubin",
    address: "Karim Tower,Amligola",
    personal_number: "01683071149",
  },
  {
    name: "Talha Ahmed",
    address: "Dhanmondi 1",
    personal_number: "01726904570",
  },
  {
    name: "Talha Asif",
    address: "Karim Tower,Amligola",
    personal_number: "01741110439",
    work_number: "01947166456",
  },
  {
    name: "Unais Anjum",
    address: "Board Office",
    personal_number: "01746258069",
  },
  {
    name: "Unais Shahzad",
    address: "Paribagh",
    personal_number: "01917285604",
  },
  {
    name: "Usman Ahmed (Gaco)",
    address: "Dhanmondi 11",
    personal_number: "01819253371",
    work_number: "01797576424",
  },
  {
    name: "Ozair Amir",
    address: "Lalbagh",
    personal_number: "01717915909",
  },
  {
    name: "Wahib Mobin",
    address: "Haseeb Villa,Amligola",
    personal_number: "01940493084",
  },
  {
    name: "Waiz Saudagar",
    address: "Dhanmondi 3",
    personal_number: "01954582800",
  },
  {
    name: "Wajih Kashif",
    address: "Zakir Villa,Jigatola",
    personal_number: "01975304602",
    work_number: "01675304602",
  },
  {
    name: "Wasiq Zafar",
    address: "Baridhara",
    personal_number: "01719698302",
  },
  {
    name: "Yousuf Farid",
    address: "Green Road",
    personal_number: "01819298210",
  },
  {
    name: "Yousuf Nasir",
    address: "Motalib Plaza,Paribagh",
    personal_number: "01911367661",
  },
  {
    name: "Zaair Saudagar",
    address: "Prince Tower,Elephant Road",
    personal_number: "01907930681",
  },
  {
    name: "Zaid Sohail",
    address: "Najeeb Villa,Nazimuddin Road",
    personal_number: "01745705878",
  },
  {
    name: "Zaid Qamar",
    address: "Dhanmondi 5",
    personal_number: "01717185095",
  },
  {
    name: "Zain Elahi",
    address: "Shankar",
    personal_number: "01787494104",
  },
  {
    name: "Zaid Akhtar",
    address: "Lalbagh",
    personal_number: "01686239883",
  },
  {
    name: "Kashif Azhar",
    address: "Zakir Villa,Jigatola",
    personal_number: "01923265895",
    work_number: "01777949616",
  },

  // Add more contacts as needed
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

  const filteredContacts = dummyContacts
    .filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <Link href="/" asChild>
          <Text style={styles.backButton}>Back</Text>
        </Link>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    color: "white",
    fontSize: 16,
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
});
