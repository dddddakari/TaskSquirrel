import AsyncStorage from "@react-native-async-storage/async-storage";

export type Task = {
  id: string;
  title: string;
  course: string;
  notes: string;
  reminder: boolean;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h) or empty
  completed: boolean;
  createdAt: string;
};

const TASKS_KEY = "tasks";

const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => a.date.localeCompare(b.date));
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    const tasks = data ? JSON.parse(data) : [];

    const normalizedTasks: Task[] = tasks.map((task: Partial<Task>) => ({
      id: task.id ?? Date.now().toString() + Math.random().toString(36).slice(2, 8),
      title: task.title ?? "",
      course: task.course ?? "",
      notes: task.notes ?? "",
      reminder: task.reminder ?? false,
      date: task.date ?? "",
      completed: task.completed ?? false,
      time: task.time ?? "",
      createdAt: task.createdAt ?? new Date().toISOString(),
    }));

    return sortTasks(normalizedTasks);
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
    throw error;
  }
};

export const addTask = async (
  task: Omit<Task, "id" | "createdAt" | "completed">
): Promise<Task> => {
  try {
    const tasks = await getTasks();

    const newTask: Task = {
      id: Date.now().toString(),
      title: task.title,
      course: task.course,
      notes: task.notes,
      reminder: task.reminder,
      date: task.date,
      time: task.time,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = sortTasks([...tasks, newTask]);
    await saveTasks(updatedTasks);

    return newTask;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const updateTask = async (updatedTask: Task): Promise<void> => {
  try {
    const tasks = await getTasks();

    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );

    await saveTasks(sortTasks(updatedTasks));
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const tasks = await getTasks();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    await saveTasks(updatedTasks);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const tasks = await getTasks();
    return tasks.find((task) => task.id === taskId) ?? null;
  } catch (error) {
    console.error("Error getting task by id:", error);
    return null;
  }
};

export const toggleTaskComplete = async (taskId: string): Promise<void> => {
  try {
    const tasks = await getTasks();

    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    );

    await saveTasks(sortTasks(updatedTasks));
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw error;
  }
};

export const clearAllTasks = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TASKS_KEY);
  } catch (error) {
    console.error("Error clearing tasks:", error);
    throw error;
  }
};