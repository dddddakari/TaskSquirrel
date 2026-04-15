import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getTasks, Task, updateTask } from "../../utils/storage";

const todayString = () => new Date().toISOString().split("T")[0];

export default function DashboardScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(async () => {
    const data = await getTasks();
    setTasks(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const today = todayString();

  const todayTasks = useMemo(
    () => tasks.filter((task) => task.date === today && !task.completed),
    [tasks, today]
  );

  const upcomingTasks = useMemo(
    () => tasks.filter((task) => task.date > today && !task.completed).slice(0, 5),
    [tasks, today]
  );

  const toggleComplete = async (task: Task) => {
    await updateTask({ ...task, completed: !task.completed });
    await loadTasks();
  };

  const renderTaskCard = ({ item }: { item: Task }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/task-details", params: { id: item.id } })}
      style={styles.taskCard}
    >
      <TouchableOpacity onPress={() => toggleComplete(item)} style={styles.checkBox}>
        {item.completed ? <Ionicons name="checkmark" size={18} color="#2c5aa0" /> : null}
      </TouchableOpacity>

      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {!!item.course && <Text style={styles.taskCourse}>{item.course}</Text>}
        <Text style={styles.taskMeta}>Due {item.date}</Text>
      </View>

      <Ionicons name="create-outline" size={22} color="#2c5aa0" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Study Planner</Text>
          <Text style={styles.headerSubtitle}>Hello, CX</Text>
        </View>
        <Ionicons name="person-circle-outline" size={30} color="#fff" />
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.blueCard]}>
          <Text style={styles.summaryLabel}>Task Due Today</Text>
          <Text style={styles.summaryCount}>{todayTasks.length}</Text>
        </View>

        <View style={[styles.summaryCard, styles.greenCard]}>
          <Text style={styles.summaryLabel}>Upcoming Event</Text>
          <Text style={styles.summaryCount}>{upcomingTasks.length}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Today Task</Text>
      {todayTasks.length === 0 ? (
        <View style={styles.emptyBox}><Text style={styles.emptyText}>No tasks due today.</Text></View>
      ) : (
        <FlatList
          data={todayTasks}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskCard}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}

      <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
      {upcomingTasks.length === 0 ? (
        <View style={styles.emptyBox}><Text style={styles.emptyText}>No upcoming deadlines.</Text></View>
      ) : (
        <FlatList
          data={upcomingTasks}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskCard}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  content: { paddingBottom: 24 },
  header: {
    backgroundColor: "#2c5aa0",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "700" },
  headerSubtitle: { color: "#fff", fontSize: 16, marginTop: 6 },
  summaryRow: { flexDirection: "row", gap: 12, paddingHorizontal: 20, paddingTop: 16 },
  summaryCard: { flex: 1, borderRadius: 8, paddingVertical: 14, alignItems: "center" },
  blueCard: { backgroundColor: "#2f68c6" },
  greenCard: { backgroundColor: "#6ca13b" },
  summaryLabel: { color: "#fff", fontSize: 15, fontWeight: "600", marginBottom: 8 },
  summaryCount: { color: "#fff", fontSize: 28, fontWeight: "700" },
  sectionTitle: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 10, fontSize: 18, fontWeight: "700" },
  emptyBox: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dedede",
  },
  emptyText: { color: "#666" },
  taskCard: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dedede",
    flexDirection: "row",
    alignItems: "center",
  },
  checkBox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#7ea1de",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  taskCourse: { fontSize: 14, color: "#333", marginTop: 2 },
  taskMeta: { fontSize: 13, color: "#666", marginTop: 4 },
});
