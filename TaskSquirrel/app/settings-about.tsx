import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const BLUE = "#2c5aa0";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoSection}>
          <Ionicons name="school" size={60} color={BLUE} />
          <Text style={styles.appName}>TaskSquirrel</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.description}>
            TaskSquirrel is a study planner built to help students stay
            organized. Track assignments, set due dates, and never miss a
            deadline.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Built With</Text>
          <Text style={styles.techItem}>React Native & Expo</Text>
          <Text style={styles.techItem}>Expo Router</Text>
          <Text style={styles.techItem}>AsyncStorage</Text>
          <Text style={styles.techItem}>TypeScript</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credits</Text>
          <Text style={styles.description}>
            Icons by Ionicons. Calendar component by react-native-calendars.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <Text style={styles.description}>
            © 2026 TaskSquirrel. All rights reserved.
          </Text>
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
  logoSection: { alignItems: "center", marginBottom: 28 },
  appName: { fontSize: 22, fontWeight: "700", color: "#222", marginTop: 10 },
  version: { fontSize: 14, color: "#999", marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 8 },
  description: { fontSize: 14, color: "#666", lineHeight: 20 },
  techItem: { fontSize: 14, color: "#444", paddingVertical: 4 },
});
