import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
<<<<<<< HEAD
import { AuthProvider, useAuth } from "../utils/auth-context";
=======
import { ThemeProviderCustom } from "../utils/theme-context";
>>>>>>> d9be1a604a82f71710f4add3f4f662b4786ee3ce

export const unstable_settings = {
  anchor: "(tabs)",
};

/**
 * Inner layout that handles auth-based navigation.
 * Redirects to sign-in when not authenticated,
 * and to (tabs) when authenticated.
 */
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check if the user is on an auth screen (sign-in or sign-up)
    const inAuthGroup = segments[0] === "sign-in" || segments[0] === "sign-up";

    if (!user && !inAuthGroup) {
      // Not signed in and not on auth screen → go to sign-in
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Signed in but still on auth screen → go to main app
      router.replace("/");
    }
  }, [user, loading, segments, router]);

  // Show a loading spinner while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#2c5aa0" />
      </View>
    );
  }

  return (
    <ThemeProviderCustom>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="task-details" options={{ headerShown: false }} />
        <Stack.Screen name="edit-task" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
        <Stack.Screen name="settings-account" options={{ headerShown: false }} />
        <Stack.Screen name="settings-notifications" options={{ headerShown: false }} />
        <Stack.Screen name="settings-appearance" options={{ headerShown: false }} />
        <Stack.Screen name="settings-privacy" options={{ headerShown: false }} />
        <Stack.Screen name="settings-help" options={{ headerShown: false }} />
        <Stack.Screen name="settings-about" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </ThemeProviderCustom>
  );
}

/**
 * Root layout wraps everything in AuthProvider so all
 * screens can access auth state via useAuth().
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
