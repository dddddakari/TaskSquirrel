import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTasks, updateTask } from '../../utils/storage';
import { useFocusEffect } from 'expo-router';

const BLUE = '#2c5aa0';
const GREEN = '#4a7c2f';

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<any[]>([]);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.date === today && !t.completed);
  const upcomingTasks = tasks
    .filter((t) => t.date > today && !t.completed)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const handleToggleComplete = async (task: any) => {
    await updateTask({ ...task, completed: !task.completed });
    loadTasks();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Study Planner</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Hello, CX</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: BLUE }]}>
            <Text style={styles.statLabel}>Task Due Today:</Text>
            <Text style={styles.statValue}>{todayTasks.length}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: GREEN }]}>
            <Text style={styles.statLabel}>Upcoming Event:</Text>
            <Text style={styles.statValue}>{upcomingTasks.length}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Today Task</Text>
        {todayTasks.length > 0 ? (
          todayTasks.map((task) => (
            <TouchableOpacity key={task.id} onPress={() => handleToggleComplete(task)}>
              <View style={styles.taskRow}>
                <Ionicons name="square-outline" size={22} color={BLUE} />
                <Text style={styles.taskRowText}>{task.title}</Text>
                <Ionicons name="clipboard-outline" size={22} color={BLUE} />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <>
            <View style={styles.taskRow} />
            <View style={styles.taskRow} />
            <View style={styles.taskRow} />
          </>
        )}

        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <View key={task.id} style={styles.deadlineRow}>
              <Text style={styles.deadlineTitle}>{task.title}</Text>
              <Text style={styles.deadlineDate}>{task.date}</Text>
            </View>
          ))
        ) : (
          <>
            <View style={styles.deadlineRow} />
            <View style={styles.deadlineRow} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: BLUE,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '500' },
  content: { padding: 20, paddingBottom: 40 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: BLUE, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { flex: 1, borderRadius: 8, padding: 14, alignItems: 'center' },
  statLabel: { color: '#fff', fontSize: 13, marginBottom: 6, textAlign: 'center' },
  statValue: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 10, marginTop: 8 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    minHeight: 52,
  },
  taskRowText: { flex: 1, marginHorizontal: 10, fontSize: 14 },
  deadlineRow: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineTitle: { fontSize: 14, color: '#222' },
  deadlineDate: { fontSize: 12, color: '#666' },
});
