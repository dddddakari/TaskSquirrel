import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_KEY = "TASKS";

export const saveTask = async (task: any) => {
  try {
    const existing = await AsyncStorage.getItem(TASKS_KEY);
    const tasks = existing ? JSON.parse(existing) : [];
    tasks.push(task);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    console.log("Tasks saved:", tasks);
  } catch (error) {
    console.error("Error saving task:", error);
    throw error;
  }
};

export const getTasks = async () => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    const tasks = data ? JSON.parse(data) : [];
    console.log("Tasks loaded:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

export const updateTask = async (updatedTask: any) => {
  const tasks = await getTasks();
  const updatedTasks = tasks.map((task: any) => 
    task.id === updatedTask.id ? updatedTask : task
  );
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
};

export const deleteTask = async (taskId: string) => {
  const tasks = await getTasks();
  const filteredTasks = tasks.filter((task: any) => task.id !== taskId);
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
};