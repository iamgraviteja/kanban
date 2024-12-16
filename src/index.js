const uid = new ShortUniqueId({ length: 10 });
let isModelOpen = false;
let priority = "";

const colors = ["bg-rose-400", "bg-blue-400", "bg-green-400", "bg-yellow-400"];
const query = (selector) => document.querySelector(selector);

const modal = query("#modal");
const closeModalBtn = query("#closeModalBtn");
const addTask = query("#add-task");
const closeFooterBtn = query("#closeModalFooterBtn");
const taskDesc = query("#taskDesc");
const createTask = query("#createTask");
const createPriority = query("#createPriority");
const todoContainer = query("#todoCont");
const inProgContainer = query("#inProgCont");
const compContainer = query("#compCont");

const openPopup = () => {
  modal.classList.remove("hidden");
};

const closePopup = () => {
  modal.classList.add("hidden");
};

const handleOnClosePopup = () => {
  closePopup();
};

const handleOnTaskChange = (event) => {
  let value = event.target.value.trim();
};

const resetForm = () => {
  taskDesc.value = "";
  createPriority.value = "";
  priority = "";
};

const createTaskCard = (task) => {
  const { id, priority, name } = task;
  const taskCard = document.createElement("div");
  taskCard.classList.add(
    "task",
    "bg-white",
    "shadow-sm",
    "hover:shadow-lg",
    "h-40",
    "mb-4",
    "cursor-pointer"
  );
  taskCard.innerHTML = `<div class="${colors[priority]} h-3 w-full"></div>
                    <div class="m-2">${id}</div>
                    <div class="m-2">${name}</div>`;
  return taskCard;
};

const createNewTask = (taskName, id, priority) => {
  if (!taskName.trim()) {
    alert("Task name cannot be empty!");
    return;
  } else if (!priority) {
    alert("Select a priority!");
    return;
  } else {
    const storedTasks = localStorage.getItem("tasks");
    const tasks = [];
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    }
    const newTask = {
      id,
      name: taskName,
      priority,
      stage: 1,
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const card = createTaskCard(newTask);
    todoContainer.appendChild(card);

    closePopup();
    resetForm();
  }
};

const handlePriorityChange = (event) => {
  const selectedValue = event.target.value;
  priority = selectedValue;
};

const handleOnCreateTask = () => {
  let taskName = taskDesc.value;
  let id = uid.rnd();
  createNewTask(taskName, id, priority);
};

const getTasksByStage = (tasks, stage) => {
  return tasks.filter((task) => task.stage == stage);
};

const init = () => {
  // Get tasks from local storage.
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  if (tasks.length) {
    const todoTasks = getTasksByStage(tasks, 1);

    if (todoTasks.length) {
      todoTasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        todoContainer.appendChild(taskCard);
      });
    }

    const inProgTasks = getTasksByStage(tasks, 2);

    if (inProgTasks.length) {
      inProgTasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        inProgContainer.appendChild(taskCard);
      });
    }

    const compTasks = getTasksByStage(tasks, 3);
    if (compTasks.length) {
      compTasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        compContainer.appendChild(taskCard);
      });
    }
  }
  // Event listeners
  addTask.addEventListener("click", openPopup);
  closeModalBtn.addEventListener("click", closePopup);
  closeFooterBtn.addEventListener("click", handleOnClosePopup);
  taskDesc.addEventListener("input", handleOnTaskChange);
  createTask.addEventListener("click", handleOnCreateTask);
  createPriority.addEventListener("change", handlePriorityChange);
};
init();
