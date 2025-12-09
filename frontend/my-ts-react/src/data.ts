import {Task} from "./types";

let nextId = 3;

export let tasks: Task[] =[
    {id:1, title:"Learn TypeScript", description:"Learn TypeScript ", status:"doing"},
    {id:2, title:"Build a full-stack App", description:"Create a simple React application using TypeScript.", status:"todo"}
];

export function createTask (title:string, description?: string): Task {
   const newTask: Task = {
    id: nextId++,
    title,
    description,
    status: "todo"
   };
   tasks.push (newTask);
   return newTask;
}


   
