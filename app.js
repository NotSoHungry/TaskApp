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
  // Edit task event
  taskList.addEventListener('click', editTask);
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

    // Add container element for the item's controls
    const controlsContainer = document.createElement('div');
    controlsContainer.className = "collection-item__controls";
    li.appendChild(controlsContainer);

    //Create edit button
    // Create new link element
    const editLink = document.createElement('a');
    // Add class to the link
    editLink.className = "edit-item secondary content";
    // Add icon to the link
    editLink.innerHTML = "<i class=\"fa fa-pencil-square-o\"></i>"
    // Append the link to the li
    controlsContainer.appendChild(editLink);

    // Create edit button
    // Create new link element
    const removeLink = document.createElement('a');
    // Add class to the link
    removeLink.className = "delete-item secondary content";
    // Add icon to the link
    removeLink.innerHTML = "<i class=\"fa fa-remove\"></i>"
    // Append the link to the li
    controlsContainer.appendChild(removeLink);
    
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
    let taskID;
    // Delegate event to "fa-remove" icon
    if (e.target.parentElement.classList.contains("delete-item")) {
      // Get task ID number
      taskID = Number(e.target.parentElement.parentElement.getAttribute('data-item-id'));
      // Remove the associated li element
      e.target.parentElement.parentElement.parentElement.remove();

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
    
    }

    e.preventDefault();
  }

  // Edit tasks function
  function editTask(e) {
    if (e.target.parentElement.classList.contains("edit-item")) {
      const editedElement = e.target.parentElement.parentElement.parentElement,
            editedElementControls = editedElement.firstElementChild,
            editForm = document.createElement('form'),
            formInput = document.createElement('input'),
            editButtonsContainer = document.createElement('div'),
            editAcceptButton = document.createElement('input'),
            editCancelButton = document.createElement('input'),
            overlayElement = document.createElement('div'),
            firstBodyChild = document.body.firstElementChild

      // Configure edited element
      // Apply 'edit' styling
      editedElement.classList.toggle('edit');
      editedElementControls.classList.toggle('hideControls');

      // Configure the form element
      editForm.className = "collection-item__edit-form"

      // Configure the input element
      formInput.type = "text";
      formInput.className = "edit-form__edit-input";
      formInput.value = editedElement.textContent;

      // Configure the container for edit buttons
      editButtonsContainer.className = "edit-form__edit-buttons";

      // Configure accept change button
      editAcceptButton.type = "submit";
      editAcceptButton.value = "Accept";
      editAcceptButton.name = "editTask";
      editAcceptButton.className = "btn btn-success edit-buttons__button accept"

      // Configure cancel change button
      editCancelButton.type = "submit";
      editCancelButton.value = "Cancel",
      editCancelButton.className = "btn btn-danger edit-buttons__button cancel"

      // Add and configure dark overlay
      overlayElement.className = "edit-overlay";
      document.body.insertBefore(overlayElement, firstBodyChild);

      // Combine edit elements
      editButtonsContainer.appendChild(editAcceptButton);
      editButtonsContainer.appendChild(editCancelButton);

      editForm.appendChild(formInput);
      editForm.appendChild(editButtonsContainer);
      editedElement.appendChild(editForm);
      formInput.focus();

      // Add event listeners for related functions
      editButtonsContainer.addEventListener('click', finishEditing);
      overlayElement.addEventListener('click', holdFocusOnForm);

      //finishEditing function
      function finishEditing(e) {
        if (e.target.classList.contains('accept')) {
          const newTaskValue = formInput.value,
                currentTaskContent = editedElement.childNodes[0],
                newTaskContent = document.createTextNode(newTaskValue);

          // Update the displayed task element
          editedElement.replaceChild(newTaskContent, currentTaskContent);

          // Update task in local storage
          let tasks = JSON.parse(localStorage.getItem('tasks'));
          tasks[editedElement.getAttribute('data-item-id')] = newTaskValue;

          localStorage.setItem('tasks', JSON.stringify(tasks));
        } else {console.log("Well...")}

        // Remove edit form and overlay
        editForm.remove();
        editedElement.classList.toggle('edit');
        overlayElement.remove();
        setTimeout(function() {
          editedElementControls.classList.toggle('hideControls');
        }, 100);
        
        

        e.preventDefault();
      }

      // holdFocusOnForm function
      function holdFocusOnForm(e) {
        formInput.focus();

        e.preventDefault();
      }


    }
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