/**
 * SettingsScreen — Static settings menu with six navigable rows.
 *
 * Each row shows an icon, a label, and a right-chevron affordance.
 * Currently the rows are placeholders — no navigation logic is wired up.
 * Add `onPress` handlers to each TouchableOpacity to navigate to
 * the corresponding sub-screen when those screens are created.
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// App-wide brand colour
const BLUE = "#2c5aa0";

/**
 * Menu items rendered in the settings list.
 * Each entry maps an Ionicons icon name to a human-readable label.
 */
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
      {/* ── Blue header bar ─────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      {/* ── Settings menu list ─────────────────────────────── */}
      <View style={styles.list}>
        {settingsItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.item}>
            {/* Icon on the left */}
            <Ionicons name={item.icon} size={22} color={BLUE} />
            {/* Label fills remaining space */}
            <Text style={styles.itemLabel}>{item.label}</Text>
            {/* Chevron hints that the row is tappable */}
            <Ionicons name="chevron-forward" size={18} color="#bbb" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Blue header bar
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

  // Outer padding for menu rows
  list: { padding: 16 },

  // Individual menu row: icon | label | chevron
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemLabel: { flex: 1, fontSize: 15, color: "#222", marginLeft: 14 },
});
