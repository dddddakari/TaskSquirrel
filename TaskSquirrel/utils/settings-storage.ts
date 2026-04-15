import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "app_settings";

export type AppSettings = {
  displayName: string;
  notificationsEnabled: boolean;
  reminderTime: string; // e.g. "09:00"
  darkMode: boolean;
  completedTaskHistory: boolean;
};

const DEFAULT_SETTINGS: AppSettings = {
  displayName: "CX",
  notificationsEnabled: true,
  reminderTime: "09:00",
  darkMode: false,
  completedTaskHistory: true,
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!data) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    console.error("Error loading settings:", error);
    return { ...DEFAULT_SETTINGS };
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};

export const updateSetting = async <K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): Promise<AppSettings> => {
  const current = await getSettings();
  const updated = { ...current, [key]: value };
  await saveSettings(updated);
  return updated;
};
