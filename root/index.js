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

const createTaskCard = (taskName, id, priority) => {
  if (!taskName.trim()) {
    alert("Task name cannot be empty!");
    return;
  }
  const todoContainer = query("#todoCont");
  const taskCard = document.createElement("div");
  taskCard.classList.add(
    "task",
    "bg-white",
    "shadow-sm",
    "hover:shadow-lg",
    "h-40",
    "mb-4"
  );
  taskCard.innerHTML = `<div class="${colors[priority]} h-3 w-full"></div>
                      <div class="m-2">${id}</div>
                      <div class="m-2">${taskName}</div>`;
  todoContainer.appendChild(taskCard);
  closePopup();
  priority = "";
};

const handlePriorityChange = (event) => {
  const selectedValue = event.target.value;
  if (selectedValue) {
    priority = selectedValue;
  } else {
    alert("Please select an option.");
  }
};

const handleOnCreateTask = () => {
  let taskName = taskDesc.value;
  let id = uid.rnd();
  createTaskCard(taskName, id, priority);
  taskDesc.value = "";
  createPriority.value = "";
};

addTask.addEventListener("click", openPopup);
closeModalBtn.addEventListener("click", closePopup);
closeFooterBtn.addEventListener("click", handleOnClosePopup);
taskDesc.addEventListener("input", handleOnTaskChange);
createTask.addEventListener("click", handleOnCreateTask);
createPriority.addEventListener("change", handlePriorityChange);
