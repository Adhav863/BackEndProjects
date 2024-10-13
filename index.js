const fs = require("fs");
const path = require("path");

const taskFilePath = path.join(__dirname, "tasks.json");

function readTasks() {
  if (fs.existsSync(taskFilePath)) {
    const data = fs.readFileSync(taskFilePath, "utf-8");

    // If file is empty, return an empty array
    if (data.trim().length === 0) {
      return [];
    }

    return JSON.parse([data]); // Parse JSON if the file is not empty
  } else {
    // If file doesn't exist, return an empty array
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2));
}

function addTask(description) {
  const tasks = readTasks();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1, // Unique ID
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  writeTasks(tasks);
  console.log(`Task added successfully (ID: ${newTask.id})`);
}

function updateTask(index, description) {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === parseInt(index));
  if (task) {
    task.description = description;
    task.updatedAt = new Date().toISOString();
    writeTasks(task);
    console.log(`Task updated successfully (ID: ${index})`);
  } else {
    console.log(`Task with ID ${id} not found`);
  }
}

function deleteTask(index) {
  let tasks = readTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== parseInt(index));
  if (tasks.length !== initialLength) {
    writeTasks(tasks);
    console.log(`Task deleted successfully (ID: ${id})`);
  } else {
    console.log(`Task with ID ${id} not found`);
  }
}

function markTask(id, status) {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === parseInt(id));
  if (task) {
    task.status = status;
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log(`Task marked as ${status} (ID: ${id})`);
  } else {
    console.log(`Task with ID ${id} not found`);
  }
}

function listTasks(status) {
  const tasks = readTasks();
  let filteredTasks = tasks;

  if (status) {
    filteredTasks = tasks.filter((t) => t.status === status);
  }

  if (filteredTasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  filteredTasks.forEach((task) => {
    console.log(
      `ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, CreatedAt: ${task.createdAt}, UpdatedAt: ${task.updatedAt}`
    );
  });
}

//Command Line Logic
const [, , command, ...args] = process.argv;

switch (command) {
  case "add":
    addTask(args.join(" "));
    break;
  case "update":
    updateTask(args[0], args.slice(1).join(" "));
    break;
  case "delete":
    deleteTask(args[0]);
    break;
  case "mark-in-progress":
    markTask(args[0], "in-progress");
    break;
  case "mark-done":
    markTask(args[0], "done");
    break;
  case "list":
    if (args[0] === "done") {
      listTasks("done");
    } else if (args[0] === "todo") {
      listTasks("todo");
    } else if (args[0] === "in-progress") {
      listTasks("in-progress");
    } else {
      listTasks();
    }
    break;
  default:
    console.log("Invalid command");
}
