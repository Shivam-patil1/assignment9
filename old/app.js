// Initialize tasks array from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Update current date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskStats();
}

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
}

// Function to toggle task completion
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Function to delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Function to filter tasks
function filterTasks(filterType) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filterType === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filterType === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    renderTaskList(filteredTasks);
}

// Function to render task list
function renderTaskList(taskArray) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    taskArray.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onclick="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        taskList.appendChild(taskElement);
    });
}

// Function to render all tasks
function renderTasks() {
    const activeFilter = document.querySelector('.filter-btn.active');
    const filterType = activeFilter ? activeFilter.textContent.toLowerCase() : 'all';
    filterTasks(filterType);
}

// Function to update task statistics
function updateTaskStats() {
    const totalTasks = tasks.length;
    const completedTasksCount = tasks.filter(task => task.completed).length;

    document.getElementById('totalTasks').textContent = `Total Tasks: ${totalTasks}`;
    document.getElementById('completedTasks').textContent = `Completed: ${completedTasksCount}`;
}

// Add event listener for Enter key
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial render
renderTasks(); 