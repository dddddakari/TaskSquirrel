import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addTask, Task } from "../../utils/storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AddTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Task must have a title");
      return;
    }

    try {
      await addTask({
        title: title.trim(),
        course: course.trim(),
        notes: notes.trim(),
        reminder,
        date: date.toISOString().split("T")[0],
      });

      Alert.alert("Success", "Task added successfully");
      setTitle("");
      setCourse("");
      setNotes("");
      setReminder(true);
      setDate(new Date());
      router.replace("/");
    } catch (error) {
      console.error("Failed to save task:", error);
      Alert.alert("Error", "Failed to save task");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Task</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
        />

        <Text style={styles.label}>Course</Text>
        <TextInput
          style={styles.input}
          value={course}
          onChangeText={setCourse}
          placeholder="Enter course name"
        />

        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setShowPicker(true)}>
          <Text style={styles.inputButtonText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(_, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <View style={styles.reminderRow}>
          <View style={styles.reminderLeft}>
            <Ionicons name="notifications" size={20} color="#111" />
            <Text style={styles.reminderLabel}>Reminder</Text>
          </View>
          <Switch value={reminder} onValueChange={setReminder} trackColor={{ true: "#5e8f3a" }} />
        </View>

        <View style={styles.separator} />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notes}
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Add task notes"
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: {
    backgroundColor: "#2c5aa0",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  form: { padding: 20, gap: 8 },
  label: { marginTop: 12, marginBottom: 6, fontSize: 16, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d8d8d8",
  },
  inputButton: {
    backgroundColor: "#fff",
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d8d8d8",
    justifyContent: "center",
  },
  inputButtonText: { color: "#111", fontSize: 15 },
  reminderRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reminderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  reminderLabel: { fontSize: 16, fontWeight: "600" },
  separator: { borderBottomWidth: 1, borderBottomColor: "#d9d9d9", marginTop: 8, marginBottom: 4 },
  notes: {
    backgroundColor: "#fff",
    minHeight: 120,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d8d8d8",
  },
  button: {
    backgroundColor: "#5e8f3a",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
