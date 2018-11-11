// Define UI Vars
const form = document.querySelector('#add-task-form'),
      taskList = document.querySelector('.collection'),
      clearBtn = document.querySelector('.clear-tasks'),
      filter = document.querySelector('#filter-tasks-form'),
      filterInput = document.querySelector('#filter-tasks'),
      taskInput = document.querySelector('#add-task');

// Load all event listeners
loadEventListeners();

// Load all event listeners function
function loadEventListeners() {
  // Add task event
  form.addEventListener('submit', addTask);
  // Remove task event
  taskList.addEventListener('click', removeTask);
  // Clear tasks event
  clearBtn.addEventListener('click', clearTasks);
  // Filter tasks event
  filter.addEventListener('input', filterTasks);
  // Load tasks from local storage event
  window.addEventListener('load', loadTasks);

  // Add task function
  function addTask(e, taskValue = taskInput.value, taskAddedManually = true) {
    if (value = '') {
      alert("Specify the task first!");
    }

    // Create li element
    const li = document.createElement('li');
    // Add class
    li.className = 'collection-item';
    // Set 'data-item-id" attribute
    li.setAttribute('data-item-id', taskList.children.length);
    // Create text node and append to the li
    li.appendChild(document.createTextNode(taskValue));
    console.log(li);
    // Create new link element
    const link = document.createElement('a');
    // Add class to the link
    link.className = "delete-item secondary content";
    // Add icon to the link
    link.innerHTML = "<i class=\"fa fa-remove\"></i>"
    // Append the link to the li
    li.appendChild(link);
    
    // Append the li to the list
    taskList.appendChild(li);

    if (taskAddedManually) {
      // Check if any tasks already present in the local storage
      let tasks;
      if (localStorage.getItem("tasks") === null) {
        tasks = [];
      } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
      }
      // Add task to the array
      tasks.push(taskInput.value);
      // Update local storage
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Clear the input
    taskInput.value = '';

    e.preventDefault();
  }

  // Remove task function
  function removeTask(e) {
    console.log(e);
    let taskID;
    // Delegate event to "fa-remove" icon
    if (e.target.parentElement.classList.contains("delete-item")) {
      // Get task ID number
      taskID = Number(e.target.parentElement.parentElement.getAttribute('data-item-id'));
      // Remove the associated li element
      e.target.parentElement.parentElement.remove();
    }

    //Get the tasks array from the local storage
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    // Remove the task from the array
    tasks.splice(taskID, 1);
    // Update local storage
    if (tasks.length) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
      localStorage.removeItem('tasks');
    }
    // Update 'data-task-id" attributes for li elements
    taskList.querySelectorAll('.collection-item').forEach((item, index) => {item.setAttribute('data-item-id', index)});

    e.preventDefault();
  }

  // Clear tasks function
  function clearTasks (e) {
    // Check if list contains any tasks
    if (taskList.children.length) {
      // Clear all tasks
      Array.prototype.concat([], ...taskList.children)
                     .forEach(task => task.remove());
      // Update local storage
      localStorage.removeItem('tasks');
    }

    e.preventDefault();
  }

  // Filter tasks function
  function filterTasks(e) {
    const tasks = Array.prototype.concat([], ...taskList.children);

    if (e.target.value !== "") {
      tasks.forEach(task => {
        if (task.textContent.toLowerCase().indexOf(e.target.value.toLowerCase()) < 0) {
          task.classList.add('hidden');
        } else {
          task.classList.remove('hidden');
        }
      });
    } else {
      tasks.forEach(task => task.classList.remove("hidden"));
    }
  }

  // Load tasks from local storage
  function loadTasks(e) {
    let tasks;
    if (localStorage.getItem('tasks') !== null) {
      tasks = JSON.parse(localStorage.getItem('tasks'));
      tasks.forEach(task => {addTask(e, task, false)});
    }
  }
}