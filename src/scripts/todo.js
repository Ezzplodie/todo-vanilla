const todoNewTaskForm = document.querySelector("[data-js-todo-new-task-form]");
const todoNewTaskInput = document.querySelector(
  "[data-js-todo-new-task-input]"
);
const todoList = document.querySelector("[data-js-todo-list]");
const todoDeleteAllTasks = document.querySelector(
  "[data-js-todo-delete-all-button]"
);
const todoSearchInput = document.querySelector(
  "[data-js-todo-search-task-input]"
);
const todoTotalTasks = document.querySelector("[data-js-todo-total-tasks]");

let tasksArray = JSON.parse(localStorage.getItem("tasks")) || [];
console.log(tasksArray);

if (tasksArray.length > 0 && typeof tasksArray[0] === "string") {
  tasksArray = tasksArray.map((text, index) => ({
    id: Date.now() + index,
    text: text,
    isDone: false,
  }));
  saveTasks();
}

let searchQuery = "";
let timeoutId;

// LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

// Render function
function renderTasks() {
  const filteredTasks = tasksArray.filter((task) =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );
  todoTotalTasks.textContent = filteredTasks.length;
  todoList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("todo__item", "todo-item");
    li.dataset.id = task.id;
    li.innerHTML = `
      <input class="todo-item__checkbox" id="todo-${task.id}" type="checkbox" ${
      task.isDone ? "checked" : ""
    }>
      <label class="todo-item__label" for="todo-${task.id}">${task.text}</label>
      <button class="todo-item__delete-button" data-id="${
        task.id
      }" type="button" aria-label="Delete" title="Delete">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5L5 15M5 5L15 15"
            stroke="#757575" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </button>
    `;
    todoList.appendChild(li);
  });

  if (filteredTasks.length > 1) {
    todoDeleteAllTasks.classList.add("is-visible");
  } else {
    todoDeleteAllTasks.classList.remove("is-visible");
  }
}

// Initial render
renderTasks();

// Task add
todoNewTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTask = todoNewTaskInput.value.trim();
  if (!newTask) return;
  tasksArray.push({
    id: Date.now(),
    text: newTask,
    isDone: false,
  });
  saveTasks();
  todoNewTaskInput.value = "";
  renderTasks();
});

// Task toggle done
todoList.addEventListener("change", (event) => {
  if (event.target.type === "checkbox") {
    const li = event.target.closest(".todo__item");
    const id = parseInt(li.dataset.id);
    const task = tasksArray.find((t) => t.id === id);
    console.log(task);
    if (task) {
      task.isDone = event.target.checked;
      saveTasks();
      renderTasks();
    }
  }
});

// Task remove
todoList.addEventListener("click", (event) => {
  if (event.target.closest(".todo-item__delete-button")) {
    const btn = event.target.closest(".todo-item__delete-button");
    const id = parseInt(btn.dataset.id);
    tasksArray = tasksArray.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  }
});

// Remove all tasks
todoDeleteAllTasks.addEventListener("click", () => {
  tasksArray.length = 0;
  saveTasks();
  renderTasks();
});

// Search + debounce
todoSearchInput.addEventListener("input", (event) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    searchQuery = event.target.value.trim();
    renderTasks();
  }, 300);
});
