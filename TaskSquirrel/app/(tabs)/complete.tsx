/**
 * CompleteScreen — Displays all tasks that have been marked as completed.
 *
 * Each completed task shows its title (with strikethrough), optional course,
 * and due date/time. Tapping the green checkmark icon reverts the task
 * back to incomplete, removing it from this list.
 *
 * If no tasks are completed yet, a friendly empty state is shown.
 * Data is refreshed every time this tab gains focus.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTasks, updateTask } from "../../utils/storage";
import { useFocusEffect } from "expo-router";

// App-wide brand colours
const BLUE = "#2c5aa0";
const GREEN = "#4a7c2f";

export default function CompleteScreen() {
  // Only the completed subset of all tasks
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);

  /** Loads all tasks, then filters to only the completed ones */
  const loadTasks = async () => {
    const data = await getTasks();
    setCompletedTasks(data.filter((t: any) => t.completed));
  };

  // Reload whenever this tab gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  /** Marks a task as incomplete and refreshes the list */
  const handleMarkIncomplete = async (task: any) => {
    await updateTask({ ...task, completed: false });
    loadTasks();
  };

  /** Renders a single completed task card */
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.taskCard}>
      <View style={{ flex: 1 }}>
        {/* Title with strikethrough to indicate completion */}
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.course ? <Text style={styles.taskCourse}>{item.course}</Text> : null}
        {/* Show "date at HH:MM" if a due time was set */}
        <Text style={styles.taskDate}>
          {item.date}{item.time ? ` at ${item.time}` : ""}
        </Text>
      </View>
      {/* Tap the checkmark to revert this task to incomplete */}
      <TouchableOpacity onPress={() => handleMarkIncomplete(item)}>
        <Ionicons name="checkmark-circle" size={26} color={GREEN} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── Blue header bar ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Complete</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      {completedTasks.length === 0 ? (
        /* ── Empty state: no completed tasks yet ───────────────── */
        <View style={styles.emptyState}>
          <Ionicons name="clipboard-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No completed tasks yet</Text>
        </View>
      ) : (
        /* ── List of completed tasks ──────────────────────────── */
        <FlatList
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Blue header bar
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

  // FlatList content padding
  list: { padding: 16, paddingBottom: 40 },

  // Completed task card — row with info on left, checkmark on right
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  // Strikethrough title to visually indicate completion
  taskTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    textDecorationLine: "line-through",
  },
  taskCourse: { fontSize: 12, color: "#666", marginTop: 2 },
  taskDate: { fontSize: 12, color: BLUE, marginTop: 2 },

  // Centred empty state with icon + message
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#aaa", fontSize: 15, marginTop: 12 },
});
