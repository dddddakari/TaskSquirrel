import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { getTasks, Task } from "../../utils/storage";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CalendarScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const loadTasks = useCallback(async () => {
    const data = await getTasks();
    setTasks(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    tasks.forEach((task) => {
      marks[task.date] = {
        ...(marks[task.date] || {}),
        marked: true,
        dotColor: task.completed ? "#999" : "#5e8f3a",
      };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: "#2c5aa0",
      };
    }

    return marks;
  }, [tasks, selectedDate]);

  const filteredTasks = useMemo(() => {
    if (!selectedDate) return tasks.filter((task) => !task.completed);
    return tasks.filter((task) => task.date === selectedDate);
  }, [tasks, selectedDate]);

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/task-details", params: { id: item.id } })}
      style={[styles.taskBox, item.completed && styles.completedTask]}
    >
      <View style={styles.taskLeft}>
        <Text style={[styles.taskTitle, item.completed && styles.completedText]}>{item.title}</Text>
        {!!item.course && <Text style={styles.taskCourse}>{item.course}</Text>}
        {!!item.notes && <Text style={styles.taskNotes} numberOfLines={1}>{item.notes}</Text>}
      </View>
      <View style={styles.taskRight}>
        <Text style={styles.taskDate}>{item.date}</Text>
        {item.reminder ? <Ionicons name="notifications" size={18} color="#2c5aa0" /> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calendar</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      <View style={styles.calendarBox}>
        <Calendar
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            selectedDayBackgroundColor: "#2c5aa0",
            todayTextColor: "#2c5aa0",
            arrowColor: "#2c5aa0",
            dotColor: "#5e8f3a",
            selectedDotColor: "#fff",
          }}
        />
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>
          {selectedDate ? `Tasks for ${selectedDate}` : "Upcoming"}
        </Text>
        {selectedDate ? (
          <TouchableOpacity onPress={() => setSelectedDate("")}>
            <Text style={styles.showAll}>Show All</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {filteredTasks.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No tasks found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
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
  calendarBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    margin: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionRow: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  showAll: { color: "#2c5aa0", fontWeight: "600" },
  emptyBox: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dedede",
  },
  emptyText: { color: "#666" },
  taskBox: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dedede",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completedTask: { opacity: 0.7 },
  taskLeft: { flex: 1, paddingRight: 12 },
  taskTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  completedText: { textDecorationLine: "line-through", color: "#666" },
  taskCourse: { marginTop: 4, color: "#444" },
  taskNotes: { marginTop: 4, color: "#666" },
  taskRight: { alignItems: "flex-end", gap: 6 },
  taskDate: { color: "#2c5aa0", fontWeight: "600" },
});
