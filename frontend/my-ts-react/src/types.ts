export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
    id:Number;
    title: string;
    description?: string;
    status: TaskStatus;
}