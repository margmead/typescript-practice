/// server/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { tasks, createTask, updateTaskStatus, deleteTask } from "../../../my-ts-project/src/data/tasks";
import { TaskStatus } from "./types/Task";

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173" })); // front-end dev server
app.use(express.json());

// Routes

// GET /tasks - list all tasks
app.get("/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

// POST /tasks - create a new task
app.post("/tasks", (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required and must be a string" });
  }

  const newTask = createTask(title, description);
  res.status(201).json(newTask);
});

// PATCH /tasks/:id/status - update status
app.patch("/tasks/:id/status", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body as { status?: TaskStatus };

  if (!status || !["todo", "doing", "done"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const updated = updateTaskStatus(id, status);
  if (!updated) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(updated);
});

// DELETE /tasks/:id - delete task
app.delete("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const ok = deleteTask(id);
  if (!ok) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
