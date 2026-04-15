import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const BLUE = "#2c5aa0";

const FAQ = [
  {
    q: "How do I add a task?",
    a: 'Tap the blue "+" button in the bottom tab bar, fill in the details, and press Save.',
  },
  {
    q: "Can I edit a task after creating it?",
    a: "Yes — tap any task to view its details, then tap the edit (pencil) icon.",
  },
  {
    q: "How do I mark a task complete?",
    a: "On the Dashboard or Calendar, tap the checkbox next to the task. You can also toggle it from the task detail screen.",
  },
  {
    q: "Where is my data stored?",
    a: "All data is stored locally on your device. Nothing is uploaded to any server.",
  },
  {
    q: "How do I delete all my tasks?",
    a: 'Go to Settings → Privacy → Clear All Tasks.',
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        {FAQ.map((item, idx) => (
          <View key={idx} style={styles.faqItem}>
            <Text style={styles.question}>{item.q}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.description}>
            Have a question or found a bug? Reach out and we'll get back to you.
          </Text>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL("mailto:support@tasksquirrel.app")}
          >
            <Ionicons name="mail-outline" size={22} color={BLUE} />
            <Text style={styles.contactLabel}>support@tasksquirrel.app</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: BLUE,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "500" },
  content: { padding: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 12 },
  faqItem: {
    marginBottom: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  question: { fontSize: 15, fontWeight: "600", color: "#222", marginBottom: 4 },
  answer: { fontSize: 14, color: "#666", lineHeight: 20 },
  contactSection: { marginTop: 16 },
  description: { fontSize: 14, color: "#666", lineHeight: 20, marginBottom: 16 },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  contactLabel: { fontSize: 15, color: BLUE, marginLeft: 12 },
});
