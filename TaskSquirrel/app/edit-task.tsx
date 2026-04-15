import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getTaskById, Task, updateTask } from "../utils/storage";

export default function EditTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTask = useCallback(async () => {
    if (!params.id || typeof params.id !== "string") return;
    setLoading(true);
    const foundTask = await getTaskById(params.id);

    if (foundTask) {
      setTask(foundTask);
      setTitle(foundTask.title);
      setCourse(foundTask.course);
      setNotes(foundTask.notes);
      setReminder(foundTask.reminder);
      setDate(new Date(foundTask.date));
    }

    setLoading(false);
  }, [params.id]);

  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [loadTask])
  );

  const handleSave = async () => {
    if (!task) return;

    if (!title.trim()) {
      Alert.alert("Error", "Task must have a title");
      return;
    }

    const updatedTask: Task = {
      ...task,
      title: title.trim(),
      course: course.trim(),
      notes: notes.trim(),
      reminder,
      date: date.toISOString().split("T")[0],
    };

    await updateTask(updatedTask);
    router.replace({ pathname: "/task-details", params: { id: updatedTask.id } });
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
        <Text style={styles.headerText}>Edit Task</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Course</Text>
        <TextInput style={styles.input} value={course} onChangeText={setCourse} />

        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setShowPicker(true)}>
          <Text>{date.toDateString()}</Text>
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
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Update Task</Text>
        </TouchableOpacity>
      </View>
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
  form: { padding: 20 },
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
