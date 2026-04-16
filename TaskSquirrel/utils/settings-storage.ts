/**
 * settings-storage.ts — Firestore settings layer for TaskSquirrel
 *
 * Stores user preferences in Firestore at users/{uid}/settings/preferences.
 * All functions require a userId parameter.
 */

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

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

/**
 * Returns a reference to the user's settings document in Firestore.
 */
const settingsDoc = (userId: string) =>
  doc(db, "users", userId, "settings", "preferences");

/**
 * Loads settings from Firestore. Returns defaults if no document exists.
 */
export const getSettings = async (userId: string): Promise<AppSettings> => {
  try {
    const docSnap = await getDoc(settingsDoc(userId));
    if (!docSnap.exists()) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...docSnap.data() };
  } catch (error) {
    console.error("Error loading settings:", error);
    return { ...DEFAULT_SETTINGS };
  }
};

/**
 * Saves the entire settings object to Firestore (merge to preserve other fields).
 */
export const saveSettings = async (userId: string, settings: AppSettings): Promise<void> => {
  try {
    await setDoc(settingsDoc(userId), settings, { merge: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};

/**
 * Updates a single setting key and returns the full updated settings object.
 */
export const updateSetting = async <K extends keyof AppSettings>(
  userId: string,
  key: K,
  value: AppSettings[K]
): Promise<AppSettings> => {
  const current = await getSettings(userId);
  const updated = { ...current, [key]: value };
  await saveSettings(userId, updated);
  return updated;
};

/**
 * Deletes all settings for the user (used for "erase all data").
 */
export const clearSettings = async (userId: string): Promise<void> => {
  try {
    const { deleteDoc: firestoreDeleteDoc } = await import("firebase/firestore");
    await firestoreDeleteDoc(settingsDoc(userId));
  } catch (error) {
    console.error("Error clearing settings:", error);
    throw error;
  }
};
