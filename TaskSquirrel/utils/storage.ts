/**
 * storage.ts — Firestore storage layer for TaskSquirrel
 *
 * Handles all CRUD operations for tasks using Firebase Firestore.
 * Every task is stored as a document in the users/{uid}/tasks collection.
 * Tasks are automatically sorted by date after every read.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Shape of a single task stored in the app.
 * All fields are required; `time` may be an empty string if no due time is set.
 */
export type Task = {
  id: string;          // Firestore document ID
  title: string;       // Task name / description
  course: string;      // Associated course (can be empty)
  notes: string;       // Additional notes (can be empty)
  reminder: boolean;   // Whether the user wants a reminder
  date: string;        // Due date in YYYY-MM-DD format
  time: string;        // Due time in HH:MM (24h) format, or empty string
  completed: boolean;  // Whether the task has been marked complete
  createdAt: string;   // ISO timestamp of when the task was created
};

/**
 * Returns a reference to the tasks sub-collection for a given user.
 */
const tasksCollection = (userId: string) =>
  collection(db, "users", userId, "tasks");

/**
 * Sorts an array of tasks by their due date in ascending order.
 * Returns a new array — does not mutate the original.
 */
const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Loads all tasks from Firestore for the given user.
 * Normalizes each task so missing fields get safe defaults —
 * this protects against tasks saved by older versions of the app
 * that may not have every field (e.g. `time` or `createdAt`).
 */
export const getTasks = async (userId: string): Promise<Task[]> => {
  try {
    const q = query(tasksCollection(userId), orderBy("date", "asc"));
    const snapshot = await getDocs(q);
    const tasks: Task[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title ?? "",
        course: data.course ?? "",
        notes: data.notes ?? "",
        reminder: data.reminder ?? false,
        date: data.date ?? "",
        completed: data.completed ?? false,
        time: data.time ?? "",
        createdAt: data.createdAt ?? new Date().toISOString(),
      };
    });

    return sortTasks(tasks);
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

/**
 * Overwrites the entire tasks collection in Firestore for the given user.
 * Used internally — prefer addTask, updateTask, deleteTask instead.
 */
export const saveTasks = async (userId: string, tasks: Task[]): Promise<void> => {
  try {
    // Delete all existing tasks first
    const snapshot = await getDocs(tasksCollection(userId));
    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    // Add all new tasks
    tasks.forEach((task) => {
      const newDocRef = doc(tasksCollection(userId));
      const { id, ...taskData } = task;
      batch.set(newDocRef, taskData);
    });
    await batch.commit();
  } catch (error) {
    console.error("Error saving tasks:", error);
    throw error;
  }
};

/**
 * Creates a new task in Firestore with auto-generated id, createdAt, and completed=false.
 * Returns the newly created Task object.
 */
export const addTask = async (
  userId: string,
  task: Omit<Task, "id" | "createdAt" | "completed">
): Promise<Task> => {
  try {
    const taskData = {
      title: task.title,
      course: task.course,
      notes: task.notes,
      reminder: task.reminder,
      date: task.date,
      time: task.time,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(tasksCollection(userId), taskData);

    return {
      id: docRef.id,
      ...taskData,
    };
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

/**
 * Replaces an existing task (matched by id) with the provided updatedTask object.
 */
export const updateTask = async (userId: string, updatedTask: Task): Promise<void> => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", updatedTask.id);
    const { id, ...taskData } = updatedTask;
    await updateDoc(taskRef, taskData);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

/**
 * Permanently removes a task by its id.
 */
export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

/**
 * Looks up a single task by id. Returns null if not found.
 */
export const getTaskById = async (userId: string, taskId: string): Promise<Task | null> => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    const docSnap = await getDoc(taskRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title ?? "",
      course: data.course ?? "",
      notes: data.notes ?? "",
      reminder: data.reminder ?? false,
      date: data.date ?? "",
      completed: data.completed ?? false,
      time: data.time ?? "",
      createdAt: data.createdAt ?? new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error getting task by id:", error);
    return null;
  }
};

/**
 * Flips the completed flag on a task (complete ↔ incomplete).
 */
export const toggleTaskComplete = async (userId: string, taskId: string): Promise<void> => {
  try {
    const task = await getTaskById(userId, taskId);
    if (!task) return;

    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(taskRef, { completed: !task.completed });
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw error;
  }
};

/**
 * Wipes all tasks from Firestore for the given user.
 */
export const clearAllTasks = async (userId: string): Promise<void> => {
  try {
    const snapshot = await getDocs(tasksCollection(userId));
    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error("Error clearing tasks:", error);
    throw error;
  }
};