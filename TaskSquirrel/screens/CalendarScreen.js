import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/Ionicons";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");

  const upcomingTasks = [
    { id: "1", title: "Math Homework" },
    { id: "2", title: "Science Project" },
    { id: "3", title: "Study for Test" },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="menu" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Calendar</Text>

        <TouchableOpacity>
          <Icon name="person-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* CALENDAR */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "#2c5aa0",
            },
          }}
          theme={{
            selectedDayBackgroundColor: "#2c5aa0",
            todayTextColor: "#2c5aa0",
          }}
        />
      </View>

      {/* UPCOMING */}
      <Text style={styles.sectionTitle}>Upcoming</Text>

      <FlatList
        data={upcomingTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskBox} />
        )}
      />

      {/* BOTTOM NAV SPACING */}
      <View style={{ height: 60 }} />
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

  calendarContainer: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 10,
    padding: 10,
  },

  sectionTitle: {
    marginLeft: 15,
    fontWeight: "600",
    marginBottom: 10,
  },

  taskBox: {
    height: 60,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
});