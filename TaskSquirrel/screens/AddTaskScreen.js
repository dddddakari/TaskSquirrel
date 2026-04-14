import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function AddTaskScreen() {
  const [reminder, setReminder] = useState(true);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Icon name="menu" size={22} color="#fff" />
        <Text style={styles.headerTitle}>Add Task</Text>
        <Icon name="person-circle-outline" size={24} color="#fff" />
      </View>

      {/* FORM */}
      <View style={styles.form}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Course</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Due Date</Text>
        <TextInput style={styles.input} />

        {/* Reminder Toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>Reminder</Text>
          <Switch value={reminder} onValueChange={setReminder} />
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput style={styles.notes} multiline />

        {/* BUTTON */}
        <TouchableOpacity style={styles.button}>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },

  headerTitle: {
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