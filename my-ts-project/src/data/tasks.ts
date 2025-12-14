export type TaskStatus = "todo" | "doing" | "done";

// my-ts-project/src/data/tasks.ts
import { Task } from "../types/Task";

let nextId = 3;

export let tasks: Task[] = [
  { id: 1, title: "Learn TypeScript", status: "doing" },
  { id: 2, title: "Build full-stack app", status: "todo" },
];

export function createTask(title: string, description?: string): Task {
  const newTask: Task = {
    id: nextId++,
    title,
    description,
    status: "todo",
  };
  tasks.push(newTask);
  return newTask;
}

export function updateTaskStatus(id: number, status: Task["status"]): Task | null {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  task.status = status;
  return task;
}

export function deleteTask(id: number): boolean {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}
