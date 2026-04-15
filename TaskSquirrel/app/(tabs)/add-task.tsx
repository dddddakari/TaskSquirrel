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

// Web fallback for date input
const WebDateInput =
  Platform.OS === "web"
    ? require("react-native-web").TextInput
    : null;

const BLUE = "#2c5aa0";
const GREEN = "#4a7c2f";

export default function AddTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = async () => {
    if (!title) {
      Alert.alert("Error", "Task must have a title");
      return;
    }

    const newTask = {
      title: title.trim(),
      course: course.trim(),
      notes: notes.trim(),
      reminder,
      date: date.toISOString().split("T")[0],
      time: time ? time.toTimeString().slice(0, 5) : "",
    };

    try {
      await addTask(newTask);
      Alert.alert("Success", "Task added!", [
        { text: "OK", onPress: () => router.push("/calendar") },
      ]);
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
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Task</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          placeholderTextColor="#bbb"
        />

        <Text style={styles.label}>Course</Text>
        <TextInput
          style={styles.input}
          value={course}
          onChangeText={setCourse}
          placeholder="Enter course name"
          placeholderTextColor="#bbb"
        />

        <Text style={styles.label}>Due Date</Text>
        {Platform.OS === "web" ? (
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

        <Text style={styles.label}>Due Time (optional)</Text>
        {Platform.OS === "web" ? (
          <input
            type="time"
            value={time ? time.toTimeString().slice(0, 5) : ""}
            onChange={(e: any) => {
              if (e.target.value) {
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

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Task</Text>
        </TouchableOpacity>
      </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  form: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 6, marginTop: 4 },
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
  dateText: { fontSize: 14, color: "#222" },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
  },
  reminderLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: "#111", marginLeft: 8 },
  divider: { height: 1, backgroundColor: "#e0e0e0", marginBottom: 16 },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 120,
    padding: 12,
    marginBottom: 24,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: GREEN,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});