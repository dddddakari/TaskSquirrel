import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CalendarScreen from "./screens/CalendarScreen";
import AddTaskScreen from "./screens/AddTaskScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Add" component={AddTaskScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}