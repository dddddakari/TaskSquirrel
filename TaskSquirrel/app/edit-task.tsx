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
import { useTheme } from "../utils/theme-context";

export default function EditTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
      <View style={[styles.loaderContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color="#2c5aa0" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.text }}>Task not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Task</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>Task Title</Text>
        <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]} value={title} onChangeText={setTitle} placeholderTextColor={colors.textMuted} />

        <Text style={[styles.label, { color: colors.text }]}>Course</Text>
        <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]} value={course} onChangeText={setCourse} placeholderTextColor={colors.textMuted} />

        <Text style={[styles.label, { color: colors.text }]}>Due Date</Text>
        <TouchableOpacity style={[styles.inputButton, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]} onPress={() => setShowPicker(true)}>
          <Text style={{ color: colors.text }}>{date.toDateString()}</Text>
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
            <Ionicons name="notifications" size={20} color={colors.text} />
            <Text style={[styles.reminderLabel, { color: colors.text }]}>Reminder</Text>
          </View>
          <Switch value={reminder} onValueChange={setReminder} trackColor={{ false: colors.switchTrackFalse, true: "#5e8f3a" }} />
        </View>

        <View style={[styles.separator, { borderBottomColor: colors.border }]} />

        <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
        <TextInput
          style={[styles.notes, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
          placeholderTextColor={colors.textMuted}
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
