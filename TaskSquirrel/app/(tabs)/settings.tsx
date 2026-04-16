/**
 * SettingsScreen — Static settings menu with six navigable rows.
 *
 * Each row shows an icon, a label, and a right-chevron affordance.
 * Currently the rows are placeholders — no navigation logic is wired up.
 * Add `onPress` handlers to each TouchableOpacity to navigate to
 * the corresponding sub-screen when those screens are created.
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../utils/auth-context";
import { useTheme } from "../../utils/theme-context";

// App-wide brand colour
const BLUE = "#2c5aa0";

/**
 * Menu items rendered in the settings list.
 * Each entry maps an Ionicons icon name to a human-readable label.
 */
const settingsItems = [
  { icon: "person-outline" as const, label: "Account", route: "/settings-account" as const },
  { icon: "notifications-outline" as const, label: "Notifications", route: "/settings-notifications" as const },
  { icon: "color-palette-outline" as const, label: "Appearance", route: "/settings-appearance" as const },
  { icon: "lock-closed-outline" as const, label: "Privacy", route: "/settings-privacy" as const },
  { icon: "help-circle-outline" as const, label: "Help & Support", route: "/settings-help" as const },
  { icon: "information-circle-outline" as const, label: "About", route: "/settings-about" as const },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { colors } = useTheme();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* ── Blue header bar ─────────────────────────────────── */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={styles.headerText}>Settings</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      {/* ── Settings menu list ─────────────────────────────── */}
      <View style={styles.list}>
        {settingsItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.item, { borderBottomColor: colors.borderLighter }]}
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon} size={22} color={BLUE} />
            <Text style={[styles.itemLabel, { color: colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out button */}
      <View style={styles.list}>
        <TouchableOpacity style={styles.signOutItem} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
          <Text style={styles.signOutLabel}>Sign Out</Text>
        </TouchableOpacity>
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

  // Sign out button row
  signOutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  signOutLabel: { flex: 1, fontSize: 15, color: "#e74c3c", marginLeft: 14, fontWeight: "600" },
});
