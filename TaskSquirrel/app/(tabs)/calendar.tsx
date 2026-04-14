import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { getTasks, deleteTask, updateTask } from "../../utils/storage";
import { useFocusEffect } from "expo-router";

export default function CalendarScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);

      const marks: any = {};
      data.forEach((task: any) => {
        marks[task.date] = {
          marked: true,
          dotColor: "#5e8f3a",
        };
      });
      setMarkedDates(marks);

      if (selectedDate) {
        setFilteredTasks(data.filter((t: any) => t.date === selectedDate));
      } else {
        setFilteredTasks(data);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const handleDayPress = (day: any) => {
    const dateStr = day.dateString;
    setSelectedDate(dateStr);
    setFilteredTasks(tasks.filter((t: any) => t.date === dateStr));
  };

  const clearFilter = () => {
    setSelectedDate("");
    setFilteredTasks(tasks);
  };

  const handleTaskPress = (task: any) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleDeleteTask = async () => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${selectedTask?.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTask(selectedTask.id);
            await loadTasks();
            setModalVisible(false);
            Alert.alert("Success", "Task deleted!");
          },
        },
      ]
    );
  };

  const handleToggleComplete = async () => {
    const updatedTask = {
      ...selectedTask,
      completed: !selectedTask.completed,
    };
    await updateTask(updatedTask);
    await loadTasks();
    setSelectedTask(updatedTask);
  };

  const computedMarkedDates = {
    ...markedDates,
    ...(selectedDate && {
      [selectedDate]: {
        ...(markedDates[selectedDate] || {}),
        selected: true,
        selectedColor: "#2c5aa0",
      },
    }),
  };

  const renderTaskItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleTaskPress(item)}>
      <View style={[styles.taskBox, item.completed && styles.completedTask]}>
        <View style={styles.taskLeft}>
          <View style={styles.taskHeader}>
            {item.completed && (
              <Text style={styles.checkmark}>✓ </Text>
            )}
            <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
              {item.title}
            </Text>
          </View>
          {item.course ? (
            <Text style={styles.taskCourse}>{item.course}</Text>
          ) : null}
          {item.notes ? (
            <Text style={styles.taskNotes} numberOfLines={1}>
              📝 {item.notes}
            </Text>
          ) : null}
        </View>
        <View style={styles.taskRight}>
          <Text style={styles.taskDate}>{item.date}</Text>
          {item.reminder && (
            <Text style={styles.reminderIcon}>🔔</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calendar</Text>
      </View>

      <View style={styles.calendarBox}>
        <Calendar
          markedDates={computedMarkedDates}
          onDayPress={handleDayPress}
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
        <Text style={styles.section}>
          {selectedDate ? `Tasks for ${selectedDate}` : "All Upcoming Tasks"}
          {!selectedDate && tasks.length > 0 && (
            <Text style={styles.taskCount}> ({tasks.length})</Text>
          )}
        </Text>
        {selectedDate ? (
          <TouchableOpacity onPress={clearFilter}>
            <Text style={styles.clearBtn}>Show All</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {filteredTasks.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            {selectedDate ? "No tasks on this day." : "No tasks yet. Add one!"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={renderTaskItem}
        />
      )}

      {/* Task Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Task Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Task Title</Text>
                <Text style={styles.detailValue}>{selectedTask?.title}</Text>
              </View>

              {selectedTask?.course && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Course</Text>
                  <Text style={styles.detailValue}>{selectedTask?.course}</Text>
                </View>
              )}

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Due Date</Text>
                <Text style={styles.detailValue}>{selectedTask?.date}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Reminder</Text>
                <Text style={styles.detailValue}>
                  {selectedTask?.reminder ? "🔔 On" : "🔕 Off"}
                </Text>
              </View>

              {selectedTask?.notes && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Notes</Text>
                  <Text style={styles.detailNotes}>{selectedTask?.notes}</Text>
                </View>
              )}

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={[styles.detailValue, selectedTask?.completed && styles.completedStatus]}>
                  {selectedTask?.completed ? "✓ Completed" : "○ In Progress"}
                </Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.completeButton]}
                  onPress={handleToggleComplete}
                >
                  <Text style={styles.modalButtonText}>
                    {selectedTask?.completed ? "Mark Incomplete" : "Mark Complete"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={handleDeleteTask}
                >
                  <Text style={styles.modalButtonText}>Delete Task</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  calendarBox: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  section: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  taskCount: {
    fontWeight: "400",
    color: "#666",
  },
  clearBtn: {
    color: "#2c5aa0",
    fontSize: 13,
    fontWeight: "500",
  },
  taskBox: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  completedTask: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7,
  },
  taskLeft: {
    flex: 1,
    marginRight: 10,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 16,
    color: "#5e8f3a",
    fontWeight: "bold",
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  taskCourse: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  taskNotes: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  taskRight: {
    alignItems: "flex-end",
  },
  taskDate: {
    fontSize: 12,
    color: "#2c5aa0",
    fontWeight: "500",
  },
  reminderIcon: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyBox: {
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c5aa0",
  },
  closeButton: {
    fontSize: 24,
    color: "#999",
  },
  detailSection: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
  },
  detailNotes: {
    fontSize: 14,
    color: "#555",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 6,
  },
  completedStatus: {
    color: "#5e8f3a",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#5e8f3a",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});