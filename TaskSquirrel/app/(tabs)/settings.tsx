import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>TaskSquirrel Settings</Text>
        <Text style={styles.text}>This is a placeholder settings page.</Text>
        <Text style={styles.text}>You can later add notification settings, profile info, and theme options here.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: {
    backgroundColor: "#2c5aa0",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  card: {
    margin: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dedede",
    borderRadius: 8,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  text: { color: "#555", marginBottom: 8, lineHeight: 22 },
});
