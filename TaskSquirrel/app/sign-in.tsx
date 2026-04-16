/**
 * sign-in.tsx — Sign In screen for TaskSquirrel
 *
 * Email + password authentication using Firebase Auth.
 * Redirects to the main app on success.
 * Links to the sign-up screen for new users.
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

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /** Validates inputs and signs in with Firebase Auth */
  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // Auth state listener in _layout.tsx will handle navigation
    } catch (error: any) {
      let message = "Sign in failed. Please try again.";
      if (error.code === "auth/user-not-found") message = "No account found with this email.";
      else if (error.code === "auth/wrong-password") message = "Incorrect password.";
      else if (error.code === "auth/invalid-email") message = "Invalid email address.";
      else if (error.code === "auth/invalid-credential") message = "Invalid email or password.";
      Alert.alert("Sign In Failed", message);
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
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>Sign in to continue</Text>
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
            placeholder="Enter your password"
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

        {/* Sign In button */}
        <TouchableOpacity
          style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Link to sign up */}
        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
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
    marginBottom: 24,
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

  signInBtn: {
    backgroundColor: BLUE,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  signInBtnDisabled: { opacity: 0.6 },
  signInBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  signUpText: { fontSize: 14, color: "#666" },
  signUpLink: { fontSize: 14, color: BLUE, fontWeight: "600" },
});
