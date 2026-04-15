/**
 * AddTaskScreen — Form screen for creating a new task.
 *
 * Lets the user enter a title, course, due date, optional due time,
 * toggle a reminder, and add notes. On save, the task is persisted
 * via the addTask() helper and the user is redirected to the Calendar tab.
 *
 * Platform handling:
 *   - Web: uses native HTML <input type="date"> and <input type="time">
 *     because DateTimePicker is not supported on web.
 *   - iOS / Android: uses @react-native-community/datetimepicker.
 *
 * Keyboard is dismissible by tapping outside the inputs (TouchableWithoutFeedback).
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { addTask } from "../../utils/storage";
import { useRouter } from "expo-router";

// Web fallback — only loaded when running on web to avoid native crash
const WebDateInput =
  Platform.OS === "web"
    ? require("react-native-web").TextInput
    : null;

// App-wide brand colours
const BLUE = "#2c5aa0";
const GREEN = "#4a7c2f";

export default function AddTaskScreen() {
  const router = useRouter();

  // ── Form state ──────────────────────────────────────────────
  const [title, setTitle] = useState("");          // Required task name
  const [course, setCourse] = useState("");         // Optional course name
  const [notes, setNotes] = useState("");           // Optional free-text notes
  const [reminder, setReminder] = useState(true);   // Reminder toggle (on by default)
  const [date, setDate] = useState(new Date());     // Selected due date
  const [showPicker, setShowPicker] = useState(false);       // Controls native date picker visibility
  const [time, setTime] = useState<Date | null>(null);       // Selected due time (null = not set)
  const [showTimePicker, setShowTimePicker] = useState(false); // Controls native time picker visibility

  /**
   * Validates the form, builds a task object, saves it to storage,
   * then resets the form and navigates to the Calendar tab.
   */
  const handleSave = async () => {
    if (!title) {
      Alert.alert("Error", "Task must have a title");
      return;
    }

    // Build the task payload (id, createdAt, completed are set by addTask)
    const newTask = {
      title: title.trim(),
      course: course.trim(),
      notes: notes.trim(),
      reminder,
      date: date.toISOString().split("T")[0],              // "YYYY-MM-DD"
      time: time ? time.toTimeString().slice(0, 5) : "",   // "HH:MM" or ""
    };

    try {
      await addTask(newTask);
      Alert.alert("Success", "Task added!", [
        { text: "OK", onPress: () => router.push("/calendar") },
      ]);

      // Reset all fields for the next task
      setTitle("");
      setCourse("");
      setNotes("");
      setDate(new Date());
      setTime(null);
    } catch (error) {
      Alert.alert("Error", "Failed to save task");
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Blue header bar ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Task</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      {/* Tapping outside inputs dismisses the keyboard */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">

        {/* ── Task Title ──────────────────────────────────────── */}
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          placeholderTextColor="#bbb"
        />

        {/* ── Course ──────────────────────────────────────────── */}
        <Text style={styles.label}>Course</Text>
        <TextInput
          style={styles.input}
          value={course}
          onChangeText={setCourse}
          placeholder="Enter course name"
          placeholderTextColor="#bbb"
        />

        {/* ── Due Date ────────────────────────────────────────── */}
        <Text style={styles.label}>Due Date</Text>
        {Platform.OS === "web" ? (
          /* Web: native HTML date input */
          <input
            type="date"
            value={date.toISOString().split("T")[0]}
            onChange={(e: any) => {
              const d = new Date(e.target.value + "T00:00:00");
              if (!isNaN(d.getTime())) setDate(d);
            }}
            style={{
              height: 46,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 6,
              paddingLeft: 12,
              marginBottom: 16,
              fontSize: 14,
              fontFamily: "inherit",
              width: "100%",
              boxSizing: "border-box",
            } as any}
          />
        ) : (
          /* Mobile: tap to reveal DateTimePicker */
          <>
            <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
              <Text style={styles.dateText}>{date.toISOString().split("T")[0]}</Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selected) => {
                  setShowPicker(false);
                  if (selected) setDate(selected);
                }}
              />
            )}
          </>
        )}

        {/* ── Due Time (optional) ─────────────────────────────── */}
        <Text style={styles.label}>Due Time (optional)</Text>
        {Platform.OS === "web" ? (
          /* Web: native HTML time input */
          <input
            type="time"
            value={time ? time.toTimeString().slice(0, 5) : ""}
            onChange={(e: any) => {
              if (e.target.value) {
                // Parse "HH:MM" string into a Date object for state
                const [h, m] = e.target.value.split(":");
                const d = new Date();
                d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
                setTime(d);
              } else {
                setTime(null);
              }
            }}
            style={{
              height: 46,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 6,
              paddingLeft: 12,
              marginBottom: 16,
              fontSize: 14,
              fontFamily: "inherit",
              width: "100%",
              boxSizing: "border-box",
            } as any}
          />
        ) : (
          /* Mobile: tap to reveal time picker */
          <>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateText}>
                {time ? time.toTimeString().slice(0, 5) : "No time set"}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time || new Date()}
                mode="time"
                display="default"
                onChange={(event, selected) => {
                  setShowTimePicker(false);
                  if (selected) setTime(selected);
                }}
              />
            )}
          </>
        )}

        {/* ── Reminder toggle ─────────────────────────────────── */}
        <View style={styles.reminderRow}>
          <Ionicons name="notifications-outline" size={20} color="#222" />
          <Text style={styles.reminderLabel}>Reminder</Text>
          <Switch
            value={reminder}
            onValueChange={setReminder}
            trackColor={{ false: "#ccc", true: GREEN }}
            thumbColor="#fff"
          />
        </View>
        <View style={styles.divider} />

        {/* ── Notes ───────────────────────────────────────────── */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Add notes..."
          placeholderTextColor="#bbb"
          textAlignVertical="top"
        />

        {/* ── Save button ─────────────────────────────────────── */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Task</Text>
        </TouchableOpacity>
      </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Blue header bar with title + user avatar icon
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

  // Scrollable form area
  form: { padding: 20, paddingBottom: 40 },

  // Shared label style for every field
  label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 6, marginTop: 4 },

  // Shared text input style (also used as a pressable date/time display)
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 46,
    paddingHorizontal: 12,
    marginBottom: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  // Text shown inside the date/time pressable input
  dateText: { fontSize: 14, color: "#222" },

  // Reminder row: icon + label + switch in one horizontal line
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
  },
  reminderLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: "#111", marginLeft: 8 },
  // Thin grey line separating reminder from notes section
  divider: { height: 1, backgroundColor: "#e0e0e0", marginBottom: 16 },

  // Multi-line text input for notes
  notesInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 120,
    padding: 12,
    marginBottom: 24,
    fontSize: 14,
  },
  // Green "Save Task" button at the bottom
  saveBtn: {
    backgroundColor: GREEN,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});