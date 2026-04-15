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

const BLUE = "#2c5aa0";

export default function AccountScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [originalName, setOriginalName] = useState("");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const s = await getSettings();
        setDisplayName(s.displayName);
        setOriginalName(s.displayName);
      })();
    }, [])
  );

  const handleSave = async () => {
    const trimmed = displayName.trim();
    if (!trimmed) {
      Alert.alert("Invalid", "Display name cannot be empty.");
      return;
    }
    await updateSetting("displayName", trimmed);
    setOriginalName(trimmed);
    Alert.alert("Saved", "Display name updated.");
  };

  const hasChanges = displayName.trim() !== originalName;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
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

        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter your name"
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
