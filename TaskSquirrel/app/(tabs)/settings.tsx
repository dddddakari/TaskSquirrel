import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BLUE = "#2c5aa0";

const settingsItems = [
  { icon: "person-outline" as const, label: "Account" },
  { icon: "notifications-outline" as const, label: "Notifications" },
  { icon: "color-palette-outline" as const, label: "Appearance" },
  { icon: "lock-closed-outline" as const, label: "Privacy" },
  { icon: "help-circle-outline" as const, label: "Help & Support" },
  { icon: "information-circle-outline" as const, label: "About" },
];

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      <View style={styles.list}>
        {settingsItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.item}>
            <Ionicons name={item.icon} size={22} color={BLUE} />
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#bbb" />
          </TouchableOpacity>
        ))}
      </View>
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
  list: { padding: 16 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemLabel: { flex: 1, fontSize: 15, color: "#222", marginLeft: 14 },
});
