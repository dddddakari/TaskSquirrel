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
import { saveTask } from "../../utils/storage";
import { useRouter } from "expo-router";

export default function AddTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(true);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = async () => {
    if (!title) {
      Alert.alert("Error", "Task must have a title");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      course,
      notes,
      reminder,
      date: date.toISOString().split("T")[0], // YYYY-MM-DD
    };

    try {
      await saveTask(newTask);
      console.log("Task saved:", newTask);
      Alert.alert("Success", "Task added!");
      router.push('/calendar');
    } catch (error) {
      console.error("Failed to save task:", error);
      Alert.alert("Error", "Failed to save task");
    }

    // reset form
    setTitle("");
    setCourse("");
    setNotes("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Task</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Course</Text>
        <TextInput style={styles.input} value={course} onChangeText={setCourse} />

        {/* DATE PICKER */}
        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
        >
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Reminder */}
        <View style={styles.row}>
          <Text style={styles.label}>Reminder</Text>
          <Switch value={reminder} onValueChange={setReminder} />
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notes}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  header: {
    backgroundColor: "#2c5aa0",
    padding: 15,
    alignItems: "center",
  },

  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  form: {
    padding: 15,
  },

  label: {
    marginBottom: 5,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#fff",
    height: 45,
    borderRadius: 6,
    marginBottom: 15,
    paddingHorizontal: 10,
  },

  notes: {
    backgroundColor: "#fff",
    height: 100,
    borderRadius: 6,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: "top",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#5e8f3a",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});