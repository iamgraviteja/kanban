const uid = new ShortUniqueId({ length: 10 });
let isModelOpen = false;
let priority = "";

const colors = ["bg-rose-400", "bg-blue-400", "bg-green-400", "bg-yellow-400"];
const STAGES = {
  todo: 0,
  inProgress: 1,
  completed: 2,
};
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
const filterPriority = query("#filterPriority");

const resetForm = () => {
  taskDesc.value = "";
  createPriority.value = "";
  priority = "";
};

const openPopup = () => {
  modal.classList.remove("hidden");
};

const closePopup = () => {
  modal.classList.add("hidden");
  resetForm();
};

const handleOnClosePopup = () => {
  closePopup();
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
    "transition",
    "cursor-pointer",
    "draggable"
  );
  taskCard.setAttribute("draggable", true);
  taskCard.setAttribute("id", id);
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
      stage: 0,
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

const getTasksByPriority = (tasks, priority) => {
  return tasks.filter((task) => task.priority == priority);
};

const handleOnPriorityFilter = (event) => {
  const priority = event.target.value;

  // Remove all the cards from all containers.
  todoContainer.replaceChildren();
  inProgContainer.replaceChildren();
  compContainer.replaceChildren();

  // If a priority is selected.
  if (priority) {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const priorityTasks = getTasksByPriority(tasks, priority);
    if (priorityTasks.length) {
      const todoTasks = getTasksByStage(priorityTasks, STAGES.todo);

      if (todoTasks.length) {
        todoTasks.forEach((task) => {
          const taskCard = createTaskCard(task);
          todoContainer.appendChild(taskCard);
        });
      }

      const inProgTasks = getTasksByStage(priorityTasks, STAGES.inProgress);

      if (inProgTasks.length) {
        inProgTasks.forEach((task) => {
          const taskCard = createTaskCard(task);
          inProgContainer.appendChild(taskCard);
        });
      }

      const compTasks = getTasksByStage(priorityTasks, STAGES.completed);
      if (compTasks.length) {
        compTasks.forEach((task) => {
          const taskCard = createTaskCard(task);
          compContainer.appendChild(taskCard);
        });
      }
    }
  } else {
    loadSavedTasks();
  }
};

const loadSavedTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  if (tasks.length) {
    const todoTasks = getTasksByStage(tasks, STAGES.todo);

    if (todoTasks.length) {
      todoTasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        todoContainer.appendChild(taskCard);
      });
    }

    const inProgTasks = getTasksByStage(tasks, STAGES.inProgress);

    if (inProgTasks.length) {
      inProgTasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        inProgContainer.appendChild(taskCard);
      });
    }

    const compTasks = getTasksByStage(tasks, STAGES.completed);
    if (compTasks.length) {
      compTasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        compContainer.appendChild(taskCard);
      });
    }
  }
};

const handleOnDragOver = (event) => {
  event.preventDefault();
};

const handleOnDrop = (event) => {
  event.preventDefault();
  const stage = event.currentTarget.getAttribute("data-stage");
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const id = event.dataTransfer.getData("text/plain");
  const ind = tasks.findIndex((task) => task.id == id);
  tasks[ind].stage = parseInt(stage);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById(id).remove();
  event.currentTarget.appendChild(createTaskCard(tasks[ind]));
};

const containers = document.querySelectorAll(".tasks-container");

containers.forEach((container) => {
  container.addEventListener("drop", handleOnDrop);
  container.addEventListener("dragover", handleOnDragOver);
});

const init = () => {
  // Get tasks from local storage.
  loadSavedTasks();
  // Event listeners
  addTask.addEventListener("click", openPopup);
  closeModalBtn.addEventListener("click", closePopup);
  closeFooterBtn.addEventListener("click", handleOnClosePopup);
  createTask.addEventListener("click", handleOnCreateTask);
  createPriority.addEventListener("change", handlePriorityChange);
  filterPriority.addEventListener("change", handleOnPriorityFilter);

  const draggableElems = document.querySelectorAll(".tasks-container");
  draggableElems.forEach((draggableElem) => {
    draggableElem.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", event.target.id);
    });
  });
};
init();
