import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getTasks, Task } from "../../utils/storage";

export default function CompleteScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(async () => {
    const allTasks = await getTasks();
    setTasks(allTasks.filter((task) => task.completed));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Complete</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No completed tasks yet.</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: "/task-details", params: { id: item.id } })}
            >
              <View style={styles.row}>
                <Ionicons name="checkmark-circle" size={22} color="#5e8f3a" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.meta}>{item.course || "No course"}</Text>
                </View>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          )}
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
  emptyBox: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dedede",
  },
  emptyText: { color: "#666" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dedede",
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "700" },
  meta: { color: "#666", marginTop: 4 },
  date: { color: "#2c5aa0", fontWeight: "600" },
});
