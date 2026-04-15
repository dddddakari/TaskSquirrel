/**
 * DashboardScreen — The home / landing screen of the app.
 *
 * Shows a greeting ("Hello, CX"), two stat boxes (tasks due today &
 * upcoming events), a list of today's tasks (tappable to toggle complete),
 * and the next 5 upcoming deadlines sorted by date.
 *
 * Data is reloaded every time this tab gains focus via useFocusEffect.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTasks, updateTask } from '../../utils/storage';
import { useFocusEffect } from 'expo-router';

// App-wide brand colours
const BLUE = '#2c5aa0';
const GREEN = '#4a7c2f';

export default function DashboardScreen() {
  // All tasks loaded from storage
  const [tasks, setTasks] = useState<any[]>([]);

  /** Fetches the full task list from AsyncStorage */
  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  // Reload tasks every time this tab is focused
  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  // Derive today's date string for filtering
  const today = new Date().toISOString().split('T')[0];

  // Tasks whose due date matches today and are not yet completed
  const todayTasks = tasks.filter((t) => t.date === today && !t.completed);

  // Next 5 incomplete tasks with a future due date, sorted earliest first
  const upcomingTasks = tasks
    .filter((t) => t.date > today && !t.completed)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  /**
   * Toggles a task between completed and incomplete,
   * then reloads the list to reflect the change.
   */
  const handleToggleComplete = async (task: any) => {
    await updateTask({ ...task, completed: !task.completed });
    loadTasks();
  };

  return (
    <View style={styles.container}>
      {/* ── Blue header bar ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Study Planner</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Greeting ──────────────────────────────────────────── */}
        <Text style={styles.greeting}>Hello, CX</Text>

        {/* ── Stat boxes (Tasks Due Today / Upcoming Events) ───── */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: BLUE }]}>
            <Text style={styles.statLabel}>Tasks Due Today:</Text>
            <Text style={styles.statValue}>{todayTasks.length}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: GREEN }]}>
            <Text style={styles.statLabel}>Upcoming Events:</Text>
            <Text style={styles.statValue}>{upcomingTasks.length}</Text>
          </View>
        </View>

        {/* ── Today's Tasks list ────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        {todayTasks.length > 0 ? (
          todayTasks.map((task) => (
            // Tap a task row to toggle its completion status
            <TouchableOpacity key={task.id} onPress={() => handleToggleComplete(task)}>
              <View style={styles.taskRow}>
                <Ionicons name="square-outline" size={22} color={BLUE} />
                <Text style={styles.taskRowText}>{task.title}</Text>
                <Ionicons name="clipboard-outline" size={22} color={BLUE} />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          // Empty placeholder rows when there are no tasks today
          <>
            <View style={styles.taskRow} />
            <View style={styles.taskRow} />
            <View style={styles.taskRow} />
          </>
        )}

        {/* ── Upcoming Deadlines list ──────────────────────────── */}
        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <View key={task.id} style={styles.deadlineRow}>
              <Text style={styles.deadlineTitle}>{task.title}</Text>
              {/* Show "date at HH:MM" if a due time was set */}
              <Text style={styles.deadlineDate}>
                {task.date}{task.time ? ` at ${task.time}` : ""}
              </Text>
            </View>
          ))
        ) : (
          // Empty placeholder rows when no upcoming deadlines exist
          <>
            <View style={styles.deadlineRow} />
            <View style={styles.deadlineRow} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Blue header bar matching the Figma design
  header: {
    backgroundColor: BLUE,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '500' },

  // Main scrollable content area
  content: { padding: 20, paddingBottom: 40 },

  // "Hello, CX" greeting in brand blue
  greeting: { fontSize: 22, fontWeight: 'bold', color: BLUE, marginBottom: 16 },

  // Horizontal row of stat boxes
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { flex: 1, borderRadius: 8, padding: 14, alignItems: 'center' },
  statLabel: { color: '#fff', fontSize: 13, marginBottom: 6, textAlign: 'center' },
  statValue: { color: '#fff', fontSize: 32, fontWeight: 'bold' },

  // Section headings ("Today's Tasks", "Upcoming Deadlines")
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 10, marginTop: 8 },

  // Individual task row with checkbox icon + title + clipboard icon
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    minHeight: 52,
  },
  taskRowText: { flex: 1, marginHorizontal: 10, fontSize: 14 },

  // Deadline row showing title on left, date on right
  deadlineRow: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineTitle: { fontSize: 14, color: '#222' },
  deadlineDate: { fontSize: 12, color: '#666' },
});
