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
import { useAuth } from "../utils/auth-context";
import { useTheme } from "../utils/theme-context";

const BLUE = "#2c5aa0";

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!user) return;
        setSettings(await getSettings(user.uid));
      })();
    }, [user])
  );

  const toggle = async (key: keyof AppSettings, value: boolean) => {
    if (!user) return;
    const updated = await updateSetting(user.uid, key, value);
    setSettings(updated);
  };

  if (!settings) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.row, { borderBottomColor: colors.borderLighter }]}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={22} color={BLUE} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Push Notifications</Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(v) => toggle("notificationsEnabled", v)}
            trackColor={{ true: BLUE }}
          />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.borderLighter }]}>
          <View style={styles.rowLeft}>
            <Ionicons name="alarm-outline" size={22} color={BLUE} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Task Reminders</Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(v) => toggle("notificationsEnabled", v)}
            trackColor={{ true: BLUE }}
          />
        </View>

        <Text style={[styles.hint, { color: colors.textMuted }]}>
          When enabled, you&apos;ll receive reminders before tasks are due.
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Reminder Time</Text>
          <View style={styles.timeRow}>
            {["07:00", "09:00", "12:00", "18:00"].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeChip,
                  { backgroundColor: colors.chipBg, borderColor: colors.chipBorder },
                  settings.reminderTime === time && styles.timeChipActive,
                ]}
                onPress={async () => {
                  if (!user) return;
                  const updated = await updateSetting(user.uid, "reminderTime", time);
                  setSettings(updated);
                }}
              >
                <Text
                  style={[
                    styles.timeChipText,
                    { color: colors.chipText },
                    settings.reminderTime === time && styles.timeChipTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
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
