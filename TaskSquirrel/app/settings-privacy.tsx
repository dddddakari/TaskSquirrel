import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { clearAllTasks } from "../utils/storage";
import { clearSettings } from "../utils/settings-storage";
import { useAuth } from "../utils/auth-context";
import { useTheme } from "../utils/theme-context";

const BLUE = "#2c5aa0";

export default function PrivacyScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();

  const handleClearTasks = () => {
    Alert.alert(
      "Clear All Tasks",
      "This will permanently delete all your tasks. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            if (!user) return;
            await clearAllTasks(user.uid);
            Alert.alert("Done", "All tasks have been deleted.");
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will erase all tasks, settings, and app data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Erase Everything",
          style: "destructive",
          onPress: async () => {
            if (!user) return;
            await clearAllTasks(user.uid);
            await clearSettings(user.uid);
            Alert.alert("Done", "All app data has been erased.");
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Data</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            All your data is stored securely in Firebase. Your tasks and settings
            are synced to your account and accessible from any device.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Manage Data</Text>

          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: colors.borderLighter }]} onPress={handleClearTasks}>
            <View style={styles.actionLeft}>
              <Ionicons name="trash-outline" size={22} color="#e74c3c" />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Clear All Tasks</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: colors.borderLighter }]} onPress={handleClearAllData}>
            <View style={styles.actionLeft}>
              <Ionicons name="nuclear-outline" size={22} color="#e74c3c" />
              <Text style={[styles.actionLabel, { color: "#e74c3c" }]}>
                Erase All App Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Permissions</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            TaskSquirrel requests only the minimum permissions needed to function.
            No camera, location, contacts, or microphone access is required.
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
  content: { padding: 24 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 8 },
  description: { fontSize: 14, color: "#666", lineHeight: 20 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionLeft: { flexDirection: "row", alignItems: "center" },
  actionLabel: { fontSize: 15, color: "#222", marginLeft: 12 },
});
