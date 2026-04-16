import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { deleteTask, getTaskById, Task, updateTask } from "../utils/storage";
import { useAuth } from "../utils/auth-context";

export default function TaskDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTask = useCallback(async () => {
    if (!params.id || typeof params.id !== "string" || !user) return;
    setLoading(true);
    const foundTask = await getTaskById(user.uid, params.id);
    setTask(foundTask);
    setLoading(false);
  }, [params.id, user]);

  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [loadTask])
  );

  const handleDelete = async () => {
    if (!task || !user) return;

    Alert.alert("Delete Task", `Delete \"${task.title}\"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTask(user.uid, task.id);
          router.replace("/");
        },
      },
    ]);
  };

  const handleToggleComplete = async () => {
    if (!task || !user) return;
    const updated = { ...task, completed: !task.completed };
    await updateTask(user.uid, updated);
    setTask(updated);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2c5aa0" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Task not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Task Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.block}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          {!!task.course && <Text style={styles.course}>{task.course}</Text>}
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={20} color="#111" />
          <Text style={styles.metaText}>Due Date: {task.date}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="notifications" size={20} color="#111" />
          <Text style={styles.metaText}>Reminder: {task.reminder ? "On" : "Off"}</Text>
        </View>

        <View style={styles.notesBox}>
          <Text style={styles.notesTitle}>Task notes</Text>
          <Text style={styles.notesText}>{task.notes || "No notes added."}</Text>
        </View>

        <TouchableOpacity style={styles.completeButton} onPress={handleToggleComplete}>
          <Text style={styles.completeButtonText}>
            {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push({ pathname: "/edit-task", params: { id: task.id } })}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#2c5aa0",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: { color: "#fff", fontSize: 24, fontWeight: "700" },
  content: { padding: 20, paddingBottom: 30 },
  block: { marginBottom: 18 },
  taskTitle: { fontSize: 30, fontWeight: "700", color: "#111" },
  course: { fontSize: 18, color: "#333", marginTop: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  metaText: { fontSize: 17, color: "#111" },
  notesBox: {
    marginTop: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    minHeight: 120,
    padding: 16,
  },
  notesTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  notesText: { fontSize: 15, color: "#444" },
  completeButton: {
    marginTop: 28,
    backgroundColor: "#5e8f3a",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 14,
  },
  completeButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  actionRow: { flexDirection: "row", gap: 16, marginTop: 18 },
  actionButton: { flex: 1, borderRadius: 8, alignItems: "center", paddingVertical: 14 },
  editButton: { backgroundColor: "#4d78b5" },
  deleteButton: { backgroundColor: "#e51b14" },
  actionButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
