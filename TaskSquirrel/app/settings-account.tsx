import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getSettings, updateSetting } from "../utils/settings-storage";
<<<<<<< HEAD
import { useAuth } from "../utils/auth-context";
=======
import { useTheme } from "../utils/theme-context";
>>>>>>> d9be1a604a82f71710f4add3f4f662b4786ee3ce

const BLUE = "#2c5aa0";

export default function AccountScreen() {
  const router = useRouter();
<<<<<<< HEAD
  const { user } = useAuth();
=======
  const { colors } = useTheme();
>>>>>>> d9be1a604a82f71710f4add3f4f662b4786ee3ce
  const [displayName, setDisplayName] = useState("");
  const [originalName, setOriginalName] = useState("");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!user) return;
        const s = await getSettings(user.uid);
        setDisplayName(s.displayName);
        setOriginalName(s.displayName);
      })();
    }, [user])
  );

  const handleSave = async () => {
    const trimmed = displayName.trim();
    if (!trimmed) {
      Alert.alert("Invalid", "Display name cannot be empty.");
      return;
    }
    if (!user) return;
    await updateSetting(user.uid, "displayName", trimmed);
    setOriginalName(trimmed);
    Alert.alert("Saved", "Display name updated.");
  };

  const hasChanges = displayName.trim() !== originalName;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={BLUE} />
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Display Name</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg, color: colors.text }]}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter your name"
          placeholderTextColor={colors.textMuted}
          maxLength={30}
        />

        <TouchableOpacity
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!hasChanges}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  avatarContainer: { alignItems: "center", marginBottom: 24 },
  label: { fontSize: 14, color: "#666", marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  saveButton: {
    backgroundColor: BLUE,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
