import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProviderCustom } from "../utils/theme-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProviderCustom>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
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
