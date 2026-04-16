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
<<<<<<< HEAD
import { useAuth } from "../utils/auth-context";
=======
import { useTheme } from "../utils/theme-context";
>>>>>>> d9be1a604a82f71710f4add3f4f662b4786ee3ce

const BLUE = "#2c5aa0";

const ACCENT_COLORS = [
  { label: "Blue", value: "#2c5aa0" },
  { label: "Teal", value: "#0a7ea4" },
  { label: "Green", value: "#4a7c2f" },
  { label: "Purple", value: "#6b3fa0" },
  { label: "Red", value: "#c0392b" },
];

export default function AppearanceScreen() {
  const router = useRouter();
<<<<<<< HEAD
  const { user } = useAuth();
=======
  const { colors, toggle } = useTheme();
>>>>>>> d9be1a604a82f71710f4add3f4f662b4786ee3ce
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!user) return;
        setSettings(await getSettings(user.uid));
      })();
    }, [user])
  );

  if (!settings) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Appearance</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.row, { borderBottomColor: colors.borderLighter }]}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={22} color={BLUE} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={async (v) => {
              if (!user) return;
              const updated = await updateSetting(user.uid, "darkMode", v);
              setSettings(updated);
              toggle();
            }}
            trackColor={{ false: colors.switchTrackFalse, true: BLUE }}
          />
        </View>

        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Toggle between light and dark themes.
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Show Completed Tasks</Text>
          <View style={[styles.row, { borderBottomColor: colors.borderLighter }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="checkmark-done-outline" size={22} color={BLUE} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Task History</Text>
            </View>
            <Switch
              value={settings.completedTaskHistory}
              onValueChange={async (v) => {
                if (!user) return;
                const updated = await updateSetting(user.uid, "completedTaskHistory", v);
                setSettings(updated);
              }}
              trackColor={{ false: colors.switchTrackFalse, true: BLUE }}
            />
          </View>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Show completed tasks on the dashboard and calendar.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Accent Color</Text>
          <View style={styles.colorRow}>
            {ACCENT_COLORS.map((c) => (
              <TouchableOpacity key={c.value} style={styles.colorOption}>
                <View style={[styles.colorCircle, { backgroundColor: c.value }]}>
                  {c.value === BLUE && (
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  )}
                </View>
                <Text style={[styles.colorLabel, { color: colors.textSecondary }]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Accent color customization coming soon.
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
  colorRow: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  colorOption: { alignItems: "center" },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  colorLabel: { fontSize: 12, color: "#666", marginTop: 4 },
});
