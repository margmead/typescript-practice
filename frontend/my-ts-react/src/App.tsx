import { useEffect, useState } from "react";
import type { Task, TaskStatus } from "./types/Task";
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from "./api/tasks";
import "./App.css";
import carIcon from "./assets/car.svg"
const STATUSES: TaskStatus[] = ["todo", "doing", "done"];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Load tasks on start
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await createTask({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
      });
      setTasks((prev) => [...prev, created]);
      setNewTitle("");
      setNewDescription("");
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    try {
      const updated = await updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  }

    if (loading) return <p className="tb-loading">Loading tasks…</p>;
  if (error) return <p className="tb-error">Error: {error}</p>;

  return (
    <div className="tb-app">
      <div className="tb-board">
        <header className="tb-header">
  <div className="tb-header-top">
    <img src={carIcon} alt="Car" className="tb-car-icon" />
    <div>
      <h1>TypeScript Task Board</h1>
      <p>A tiny full-stack app with React + Express + TypeScript.</p>
    </div>
  </div>
</header>


        {/* Create a task */}
        <form className="tb-form" onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        {/* Columns */}
        <div className="tb-columns">
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Column({ status, tasks, onStatusChange, onDelete }: ColumnProps) {
  const label = status === "todo" ? "To do" : status === "doing" ? "Doing" : "Done";

  return (
    <div className="tb-column">
      <h2 className={`tb-column-title tb-column-title--${status}`}>{label}</h2>

      {tasks.length === 0 && <p className="tb-empty">No tasks</p>}

      {tasks.map((task) => (
        <div key={task.id} className="tb-task">
          <strong className="tb-task-title">{task.title}</strong>
          {task.description && (
            <p className="tb-task-desc">{task.description}</p>
          )}

          <div className="tb-task-footer">
            <div className="tb-status-buttons">
              {(["todo", "doing", "done"] as TaskStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(task.id, s)}
                  className={
                    "tb-status-btn" +
                    (task.status === s ? ` tb-status-btn--${s} tb-status-btn--active` : "")
                  }
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="tb-delete-btn"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}


export default App;
