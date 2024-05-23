let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskId = null;

document.getElementById('addTaskButton').addEventListener('click', addOrUpdateTask);
document.getElementById('filterTitle').addEventListener('input', filterTasks);
document.getElementById('filterDueDate').addEventListener('change', filterTasks);
document.getElementById('filterCategory').addEventListener('change', filterTasks);
document.getElementById('filterPriority').addEventListener('change', filterTasks);
document.getElementById('sortTasks').addEventListener('change', filterTasks);

function addOrUpdateTask() {
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const dueDate = document.getElementById('taskDueDate').value;
  const category = document.getElementById('taskCategory').value;
  const priority = document.getElementById('taskPriority').value;

  if (title && description && dueDate) {
    if (editingTaskId !== null) {
      tasks = tasks.map(task => task.id === editingTaskId ? { id: editingTaskId, title, description, dueDate, category, priority } : task);
      editingTaskId = null;
    } else {
      const id = new Date().getTime();
      tasks.push({ id, title, description, dueDate, category, priority });
    }
    saveTasks();
    renderTasks(tasks);
    clearForm();
  }
}

function renderTasks(taskList) {
  const taskListDiv = document.getElementById('taskList');
  taskListDiv.innerHTML = '';
  taskList.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.innerHTML = `
      <h2>${task.title}</h2>
      <p>${task.description}</p>
      <p>Due: ${task.dueDate}</p>
      <p>Category: ${task.category}</p>
      <p>Priority: ${task.priority}</p>
      <button onclick="editTask(${task.id})">Edit</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskListDiv.appendChild(taskDiv);
  });
}

function filterTasks() {
  const filterTitle = document.getElementById('filterTitle').value.toLowerCase();
  const filterDueDate = document.getElementById('filterDueDate').value;
  const filterCategory = document.getElementById('filterCategory').value;
  const filterPriority = document.getElementById('filterPriority').value;
  const sortOption = document.getElementById('sortTasks').value;

  let filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(filterTitle) &&
    (!filterDueDate || task.dueDate === filterDueDate) &&
    (!filterCategory || task.category === filterCategory) &&
    (!filterPriority || task.priority === filterPriority)
  );

  switch(sortOption) {
    case 'alphabetical':
      filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'reverseAlphabetical':
      filteredTasks.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'soonest':
      filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case 'latest':
      filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      break;
  }

  renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(taskList) {
  const filteredTaskListDiv = document.getElementById('filteredTaskList');
  filteredTaskListDiv.innerHTML = '';
  taskList.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.innerHTML = `
      <h2>${task.title}</h2>
      <p>${task.description}</p>
      <p>Due: ${task.dueDate}</p>
      <p>Category: ${task.category}</p>
      <p>Priority: ${task.priority}</p>
    `;
    filteredTaskListDiv.appendChild(taskDiv);
  });
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskDueDate').value = task.dueDate;
    document.getElementById('taskCategory').value = task.category;
    document.getElementById('taskPriority').value = task.priority;
    editingTaskId = id;
  }
}

function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks(tasks);
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearForm() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDueDate').value = '';
  document.getElementById('taskCategory').value = 'Work';
  document.getElementById('taskPriority').value = 'Low';
}

// Initial rendering of tasks
renderTasks(tasks);
