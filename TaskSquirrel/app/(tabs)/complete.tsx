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

const BLUE = "#2c5aa0";
const GREEN = "#4a7c2f";

export default function CompleteScreen() {
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);

  const loadTasks = async () => {
    const data = await getTasks();
    setCompletedTasks(data.filter((t: any) => t.completed));
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const handleMarkIncomplete = async (task: any) => {
    await updateTask({ ...task, completed: false });
    loadTasks();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.taskCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.course ? <Text style={styles.taskCourse}>{item.course}</Text> : null}
        <Text style={styles.taskDate}>{item.date}</Text>
      </View>
      <TouchableOpacity onPress={() => handleMarkIncomplete(item)}>
        <Ionicons name="checkmark-circle" size={26} color={GREEN} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Complete</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      {completedTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="clipboard-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No completed tasks yet</Text>
        </View>
      ) : (
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
  list: { padding: 16, paddingBottom: 40 },
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
  taskTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    textDecorationLine: "line-through",
  },
  taskCourse: { fontSize: 12, color: "#666", marginTop: 2 },
  taskDate: { fontSize: 12, color: BLUE, marginTop: 2 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#aaa", fontSize: 15, marginTop: 12 },
});
