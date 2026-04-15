/**
 * storage.ts — Async storage layer for TaskSquirrel
 *
 * Handles all CRUD operations for tasks using AsyncStorage.
 * Every task is persisted as JSON under the "tasks" key.
 * Tasks are automatically sorted by date after every write.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Shape of a single task stored in the app.
 * All fields are required; `time` may be an empty string if no due time is set.
 */
export type Task = {
  id: string;          // Unique identifier (timestamp-based)
  title: string;       // Task name / description
  course: string;      // Associated course (can be empty)
  notes: string;       // Additional notes (can be empty)
  reminder: boolean;   // Whether the user wants a reminder
  date: string;        // Due date in YYYY-MM-DD format
  time: string;        // Due time in HH:MM (24h) format, or empty string
  completed: boolean;  // Whether the task has been marked complete
  createdAt: string;   // ISO timestamp of when the task was created
};

/** AsyncStorage key under which all tasks are stored */
const TASKS_KEY = "tasks";

/**
 * Sorts an array of tasks by their due date in ascending order.
 * Returns a new array — does not mutate the original.
 */
const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Loads all tasks from AsyncStorage.
 * Normalizes each task so missing fields get safe defaults —
 * this protects against tasks saved by older versions of the app
 * that may not have every field (e.g. `time` or `createdAt`).
 */
export const getTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    const tasks = data ? JSON.parse(data) : [];

    // Normalize: fill in any missing fields with sensible defaults
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

/**
 * Overwrites the entire tasks array in AsyncStorage.
 * Used internally by addTask, updateTask, deleteTask, etc.
 */
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
    throw error;
  }
};

/**
 * Creates a new task with an auto-generated id, createdAt, and completed=false.
 * Appends it to the existing list, sorts, and persists.
 * Returns the newly created Task object.
 */
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

/**
 * Replaces an existing task (matched by id) with the provided updatedTask object.
 * Re-sorts after replacing so the list stays in date order.
 */
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

/**
 * Permanently removes a task by its id.
 */
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

/**
 * Looks up a single task by id. Returns null if not found.
 */
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const tasks = await getTasks();
    return tasks.find((task) => task.id === taskId) ?? null;
  } catch (error) {
    console.error("Error getting task by id:", error);
    return null;
  }
};

/**
 * Flips the completed flag on a task (complete ↔ incomplete).
 */
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

/**
 * Wipes all tasks from storage. Used for debugging / reset.
 */
export const clearAllTasks = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TASKS_KEY);
  } catch (error) {
    console.error("Error clearing tasks:", error);
    throw error;
  }
};