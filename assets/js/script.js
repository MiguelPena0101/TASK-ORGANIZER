// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Create a function to create a task card
function createTaskCard(task) {
  return `
    <div class="card task-card mb-2" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
        <button class="btn btn-danger btn-sm delete-task">Delete</button>
      </div>
    </div>
  `;
}

// Create a function to render the task list and make cards draggable
function renderTaskList() {
  $('#todo-cards').empty();
  $('#in-progress-cards').empty();
  $('#done-cards').empty();

  taskList.forEach(task => {
    const card = createTaskCard(task);
    if (task.status === 'to-do') {
      $('#todo-cards').append(card);
    } else if (task.status === 'in-progress') {
      $('#in-progress-cards').append(card);
    } else if (task.status === 'done') {
      $('#done-cards').append(card);
    }
  });

  $('.task-card').draggable({
    revert: "invalid",
    helper: "clone"
  });

  $('.delete-task').click(handleDeleteTask);
}

// Create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const task = {
    id: generateTaskId(),
    title: $('#taskTitle').val(),
    description: $('#taskDescription').val(),
    status: $('#taskStatus').val(),
    dueDate: $('#dueDate').val()
  };

  console.log(`Adding task with status: ${task.status}`); // Debugging log

  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", nextId);

  renderTaskList();
  $('#formModal').modal('hide');
  $('#taskForm')[0].reset();
}

// Create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).closest('.task-card').data('id');
  taskList = taskList.filter(task => task.id !== taskId);

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.helper.data('id');
  const newStatus = $(this).attr('id').replace('-cards', ''); // Extracting the status from the ID

  const task = taskList.find(task => task.id === taskId);
  task.status = newStatus;

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  $('#taskForm').submit(handleAddTask);

  $('.lane').droppable({
    accept: '.task-card',
    drop: handleDrop
  });

  $('#dueDate').datepicker();
});