/**
 * sign-up.tsx — Sign Up screen for TaskSquirrel
 *
 * Email + password registration using Firebase Auth.
 * Confirms password match before creating the account.
 * Links back to the sign-in screen for returning users.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../utils/auth-context";

// App-wide brand colours
const BLUE = "#2c5aa0";
const GREEN = "#4a7c2f";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /** Validates inputs and creates a new Firebase Auth account */
  const handleSignUp = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Please enter a password.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password);
      // Auth state listener in _layout.tsx will handle navigation
    } catch (error: any) {
      let message = "Sign up failed. Please try again.";
      if (error.code === "auth/email-already-in-use") message = "An account with this email already exists.";
      else if (error.code === "auth/invalid-email") message = "Invalid email address.";
      else if (error.code === "auth/weak-password") message = "Password is too weak. Use at least 6 characters.";
      Alert.alert("Sign Up Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Blue header bar */}
      <View style={styles.header}>
        <Text style={styles.headerText}>TaskSquirrel</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* App icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="school" size={64} color={BLUE} />
          <Text style={styles.welcomeText}>Create Account</Text>
          <Text style={styles.subtitleText}>Sign up to get started</Text>
        </View>

        {/* Email input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#bbb"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Password input */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            placeholderTextColor="#bbb"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password input */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter your password"
          placeholderTextColor="#bbb"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />

        {/* Sign Up button */}
        <TouchableOpacity
          style={[styles.signUpBtn, loading && styles.signUpBtnDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signUpBtnText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Link to sign in */}
        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: BLUE,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "700" },

  content: { padding: 24, paddingBottom: 40 },

  iconContainer: { alignItems: "center", marginBottom: 32, marginTop: 16 },
  welcomeText: { fontSize: 24, fontWeight: "700", color: "#111", marginTop: 12 },
  subtitleText: { fontSize: 14, color: "#888", marginTop: 4 },

  label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 6, marginTop: 4 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 46,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: "#fff",
  },

  passwordRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 46,
    marginBottom: 16,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    height: 46,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  eyeButton: { paddingHorizontal: 12 },

  signUpBtn: {
    backgroundColor: GREEN,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  signUpBtnDisabled: { opacity: 0.6 },
  signUpBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  signInText: { fontSize: 14, color: "#666" },
  signInLink: { fontSize: 14, color: BLUE, fontWeight: "600" },
});
