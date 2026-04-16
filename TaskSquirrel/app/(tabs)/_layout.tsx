/**
 * TabLayout — Defines the bottom tab navigator for the entire app.
 *
 * Five tabs in order:
 *   1. Dashboard (index)  — home icon
 *   2. Calendar           — calendar icon
 *   3. Add Task           — raised blue circle "+" button (no label)
 *   4. Complete           — clipboard icon
 *   5. Settings           — gear icon
 *
 * Each screen hides its own header (headerShown: false) because
 * every screen renders its own custom blue header bar.
 */

import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme-context';

// App-wide brand colour used for active tab tint and the add button
const BLUE = '#2c5aa0';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,             // Each screen has its own header
        tabBarActiveTintColor: BLUE,    // Selected tab icon/label colour
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBg,
          borderTopWidth: 1,
          borderTopColor: colors.tabBorder,
          height: 62,
          paddingBottom: 6,
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      {/* ── Tab 1: Dashboard (home screen) ─────────────────── */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* ── Tab 2: Calendar with task list ─────────────────── */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />

      {/* ── Tab 3: Add Task — raised circular blue button ──── */}
      <Tabs.Screen
        name="add-task"
        options={{
          title: '',  // No label — the circle is the affordance
          tabBarIcon: () => (
            <View style={styles.addButton}>
              <Ionicons name="add" size={30} color="#fff" />
            </View>
          ),
        }}
      />

      {/* ── Tab 4: Completed tasks ─────────────────────────── */}
      <Tabs.Screen
        name="complete"
        options={{
          title: 'Complete',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard" size={size} color={color} />
          ),
        }}
      />

      {/* ── Tab 5: Settings menu ───────────────────────────── */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// ── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  /**
   * Raised circular "add" button that floats above the tab bar.
   * Uses marginBottom to push the circle above the bar line,
   * and elevation / shadow for a lifted appearance.
   */
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});