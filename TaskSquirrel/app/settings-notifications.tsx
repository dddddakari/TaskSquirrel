import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getSettings, updateSetting, AppSettings } from "../utils/settings-storage";

const BLUE = "#2c5aa0";

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => setSettings(await getSettings()))();
    }, [])
  );

  const toggle = async (key: keyof AppSettings, value: boolean) => {
    const updated = await updateSetting(key, value);
    setSettings(updated);
  };

  if (!settings) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={22} color={BLUE} />
            <Text style={styles.rowLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(v) => toggle("notificationsEnabled", v)}
            trackColor={{ true: BLUE }}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="alarm-outline" size={22} color={BLUE} />
            <Text style={styles.rowLabel}>Task Reminders</Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(v) => toggle("notificationsEnabled", v)}
            trackColor={{ true: BLUE }}
          />
        </View>

        <Text style={styles.hint}>
          When enabled, you'll receive reminders before tasks are due.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Time</Text>
          <View style={styles.timeRow}>
            {["07:00", "09:00", "12:00", "18:00"].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeChip,
                  settings.reminderTime === time && styles.timeChipActive,
                ]}
                onPress={async () => {
                  const updated = await updateSetting("reminderTime", time);
                  setSettings(updated);
                }}
              >
                <Text
                  style={[
                    styles.timeChipText,
                    settings.reminderTime === time && styles.timeChipTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>
            Daily reminder will be sent at this time for upcoming tasks.
          </Text>
        </View>
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
  content: { padding: 24 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowLabel: { fontSize: 15, color: "#222", marginLeft: 12 },
  hint: { fontSize: 13, color: "#999", marginTop: 10 },
  section: { marginTop: 28 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 12 },
  timeRow: { flexDirection: "row", gap: 10 },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
  },
  timeChipActive: { backgroundColor: BLUE, borderColor: BLUE },
  timeChipText: { fontSize: 14, color: "#555" },
  timeChipTextActive: { color: "#fff", fontWeight: "600" },
});
