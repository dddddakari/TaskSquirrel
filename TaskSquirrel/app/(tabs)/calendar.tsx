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
  TextInput,
  Switch,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { getTasks, deleteTask, updateTask } from "../../utils/storage";
import { useFocusEffect } from "expo-router";

const BLUE = "#2c5aa0";
const GREEN = "#4a7c2f";
const RED = "#cc2222";

export default function CalendarScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editReminder, setEditReminder] = useState(false);
  const [editTime, setEditTime] = useState("");
  const [showEditTimePicker, setShowEditTimePicker] = useState(false);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);

      const marks: any = {};
      data.forEach((task: any) => {
        marks[task.date] = { marked: true, dotColor: GREEN };
      });
      setMarkedDates(marks);

      if (selectedDate) {
        setFilteredTasks(data.filter((t: any) => t.date === selectedDate));
      } else {
        setFilteredTasks(data.filter((t: any) => !t.completed));
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
    setFilteredTasks(tasks.filter((t: any) => !t.completed));
  };

  const handleTaskPress = (task: any) => {
    setSelectedTask(task);
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleStartEdit = () => {
    setEditTitle(selectedTask?.title ?? "");
    setEditCourse(selectedTask?.course ?? "");
    setEditDate(selectedTask?.date ?? "");
    setEditNotes(selectedTask?.notes ?? "");
    setEditReminder(selectedTask?.reminder ?? false);
    setEditTime(selectedTask?.time ?? "");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      Alert.alert("Error", "Task title cannot be empty");
      return;
    }
    const updated = {
      ...selectedTask,
      title: editTitle.trim(),
      course: editCourse.trim(),
      date: editDate.trim(),
      notes: editNotes.trim(),
      reminder: editReminder,
      time: editTime,
    };
    await updateTask(updated);
    setSelectedTask(updated);
    await loadTasks();
    setIsEditing(false);
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
          },
        },
      ]
    );
  };

  const handleToggleComplete = async () => {
    const updatedTask = { ...selectedTask, completed: !selectedTask.completed };
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
        selectedColor: BLUE,
      },
    }),
  };

  const renderTaskItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleTaskPress(item)}>
      <View style={[styles.taskCard, item.completed && styles.completedCard]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskCardTitle, item.completed && styles.completedText]}>
            {item.title}
          </Text>
          {item.course ? (
            <Text style={styles.taskCardCourse}>{item.course}</Text>
          ) : null}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.taskCardDate}>
            {item.date}{item.time ? ` ${item.time}` : ""}
          </Text>
          {item.reminder && (
            <Ionicons name="notifications" size={14} color={BLUE} style={{ marginTop: 4 }} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Calendar</Text>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </View>

      <ScrollView>
        {/* Calendar */}
        <View style={styles.calendarBox}>
          <Calendar
            markedDates={computedMarkedDates}
            onDayPress={handleDayPress}
            theme={{
              selectedDayBackgroundColor: BLUE,
              todayTextColor: BLUE,
              arrowColor: BLUE,
              dotColor: GREEN,
              selectedDotColor: "#fff",
              textDayFontSize: 14,
              textMonthFontSize: 15,
              textDayHeaderFontSize: 13,
            }}
          />
        </View>

        {/* Upcoming section */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            {selectedDate ? `Tasks for ${selectedDate}` : "Upcoming"}
          </Text>
          {selectedDate ? (
            <TouchableOpacity onPress={clearFilter}>
              <Text style={styles.clearBtn}>Show All</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {filteredTasks.length === 0 ? (
          <>
            <View style={styles.emptyCard} />
            <View style={styles.emptyCard} />
            <View style={styles.emptyCard} />
          </>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTaskItem}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </ScrollView>

      {/* Task Details Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  setIsEditing(false);
                } else {
                  setModalVisible(false);
                }
              }}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>
              {isEditing ? "Edit Task" : "Task Details"}
            </Text>
            {isEditing ? (
              <TouchableOpacity onPress={handleSaveEdit} style={styles.saveHeaderBtn}>
                <Text style={styles.saveHeaderBtnText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 52 }} />
            )}
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
            {isEditing ? (
              <>
                <Text style={styles.editLabel}>Task Title</Text>
                <TextInput
                  style={styles.editInput}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Task title"
                />
                <Text style={styles.editLabel}>Course</Text>
                <TextInput
                  style={styles.editInput}
                  value={editCourse}
                  onChangeText={setEditCourse}
                  placeholder="Course name"
                />
                <Text style={styles.editLabel}>Due Date</Text>
                {Platform.OS === "web" ? (
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e: any) => setEditDate(e.target.value)}
                    style={{
                      height: 46, border: "1px solid #ccc", borderRadius: 6,
                      paddingLeft: 12, marginBottom: 16, fontSize: 14,
                      fontFamily: "inherit", width: "100%", boxSizing: "border-box",
                    } as any}
                  />
                ) : (
                  <TextInput
                    style={styles.editInput}
                    value={editDate}
                    onChangeText={setEditDate}
                    placeholder="YYYY-MM-DD"
                    keyboardType="numeric"
                  />
                )}
                <Text style={styles.editLabel}>Due Time (optional)</Text>
                {Platform.OS === "web" ? (
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e: any) => setEditTime(e.target.value || "")}
                    style={{
                      height: 46, border: "1px solid #ccc", borderRadius: 6,
                      paddingLeft: 12, marginBottom: 16, fontSize: 14,
                      fontFamily: "inherit", width: "100%", boxSizing: "border-box",
                    } as any}
                  />
                ) : (
                  <>
                    <TouchableOpacity style={styles.editInput} onPress={() => setShowEditTimePicker(true)}>
                      <Text style={{ fontSize: 14, color: editTime ? "#222" : "#999" }}>
                        {editTime || "No time set"}
                      </Text>
                    </TouchableOpacity>
                    {showEditTimePicker && (
                      <DateTimePicker
                        value={editTime ? (() => { const [h, m] = editTime.split(":"); const d = new Date(); d.setHours(parseInt(h), parseInt(m)); return d; })() : new Date()}
                        mode="time"
                        display="default"
                        onChange={(event, selected) => {
                          setShowEditTimePicker(false);
                          if (selected) setEditTime(selected.toTimeString().slice(0, 5));
                        }}
                      />
                    )}
                  </>
                )}
                <View style={styles.editReminderRow}>
                  <Ionicons name="notifications-outline" size={18} color="#222" />
                  <Text style={styles.editReminderLabel}>Reminder</Text>
                  <Switch
                    value={editReminder}
                    onValueChange={setEditReminder}
                    trackColor={{ false: "#ccc", true: GREEN }}
                    thumbColor="#fff"
                  />
                </View>
                <View style={styles.divider} />
                <Text style={styles.editLabel}>Notes</Text>
                <TextInput
                  style={styles.editNotesInput}
                  value={editNotes}
                  onChangeText={setEditNotes}
                  multiline
                  placeholder="Add notes..."
                  textAlignVertical="top"
                />
                <TouchableOpacity style={styles.completeBtn} onPress={handleSaveEdit}>
                  <Text style={styles.completeBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Title + Course */}
                <Text style={styles.detailTaskTitle}>{selectedTask?.title}</Text>
                {selectedTask?.course ? (
                  <Text style={styles.detailCourse}>{selectedTask.course}</Text>
                ) : null}
                <View style={styles.divider} />

                {/* Due Date */}
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={18} color="#222" />
                  <Text style={styles.detailRowText}>{selectedTask?.date}</Text>
                </View>

                {/* Due Time */}
                {selectedTask?.time ? (
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={18} color="#222" />
                    <Text style={styles.detailRowText}>{selectedTask.time}</Text>
                  </View>
                ) : null}

                {/* Reminder */}
                <View style={styles.detailRow}>
                  <Ionicons name="notifications-outline" size={18} color="#222" />
                  <Text style={styles.detailRowText}>
                    Reminder: {selectedTask?.reminder ? "On" : "Off"}
                  </Text>
                </View>

                {/* Notes box */}
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>
                    {selectedTask?.notes || "Task notes"}
                  </Text>
                </View>

                {/* Buttons */}
                <TouchableOpacity style={styles.completeBtn} onPress={handleToggleComplete}>
                  <Text style={styles.completeBtnText}>
                    {selectedTask?.completed ? "Mark as Incomplete" : "Mark as Complete"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.editBtn} onPress={handleStartEdit}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteTask}>
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
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
  calendarBox: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  clearBtn: { color: BLUE, fontSize: 13, fontWeight: "500" },
  taskCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  completedCard: { backgroundColor: "#f5f5f5", opacity: 0.7 },
  taskCardTitle: { fontSize: 14, fontWeight: "600", color: "#222" },
  completedText: { textDecorationLine: "line-through", color: "#999" },
  taskCardCourse: { fontSize: 12, color: "#666", marginTop: 2 },
  taskCardDate: { fontSize: 12, color: BLUE, fontWeight: "500" },
  emptyCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    minHeight: 54,
  },
  // Modal styles
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    backgroundColor: BLUE,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 32 },
  saveHeaderBtn: { paddingHorizontal: 8 },
  saveHeaderBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  editLabel: { fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 5, marginTop: 4 },
  editInput: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 6,
    height: 46, paddingHorizontal: 12, marginBottom: 14, fontSize: 14,
  },
  editNotesInput: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 6,
    height: 100, padding: 12, marginBottom: 20, fontSize: 14,
  },
  editReminderRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  editReminderLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: "#111", marginLeft: 8 },
  modalHeaderText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  modalBody: { padding: 20, paddingBottom: 40 },
  detailTaskTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  detailCourse: { fontSize: 14, color: "#444", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 16 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  detailRowText: { fontSize: 15, color: "#222", marginLeft: 8 },
  notesBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
    marginTop: 16,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notesText: { color: "#888", fontSize: 14 },
  completeBtn: {
    backgroundColor: GREEN,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  completeBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  actionRow: { flexDirection: "row", gap: 12 },
  editBtn: {
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  editBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  deleteBtn: {
    flex: 1,
    backgroundColor: RED,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  deleteBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});

