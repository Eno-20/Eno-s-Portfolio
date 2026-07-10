const taskInput = document.getElementById('taskInput');
const taskCategory = document.getElementById('taskCategory');
const taskDate = document.getElementById('taskDate');
const taskPriority = document.getElementById('taskPriority');
const addTaskBtn = document.getElementById('addTaskBtn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const todayDate = document.getElementById('todayDate');
const currentTime = document.getElementById('currentTime');
const plannerPercent = document.getElementById('plannerPercent');
const plannerProgressBar = document.getElementById('plannerProgressBar');

let tasks = JSON.parse(localStorage.getItem('academicTasks')) || [];

function saveTasks() {
    localStorage.setItem('academicTasks', JSON.stringify(tasks));
}

function getPriorityColor(priority) {
    if (priority === 'High') return '🔴';
    if (priority === 'Low') return '🟢';
    return '🟡';
}

function getStatusBadge(task) {
    return task.completed ? '🟢 Completed' : '🟡 Pending';
}

function updateDateTime() {
    const now = new Date();
    todayDate.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    currentTime.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function renderTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filter = filterSelect.value;

    let filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchTerm));

    if (filter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    taskList.innerHTML = '';

    const completed = filteredTasks.filter(task => task.completed).length;
    const pending = filteredTasks.length - completed;
    const percentage = filteredTasks.length ? Math.round((completed / filteredTasks.length) * 100) : 0;

    totalTasks.textContent = filteredTasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    plannerPercent.textContent = `${percentage}%`;
    plannerProgressBar.style.width = `${percentage}%`;

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="empty-state">📚 No academic tasks yet. Start by adding your first task.</li>';
        taskCount.textContent = '0 tasks added';
        return;
    }

    taskCount.textContent = `${filteredTasks.length} task${filteredTasks.length > 1 ? 's' : ''} added`;

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        const realIndex = tasks.findIndex(item => item.title === task.title && item.date === task.date && item.category === task.category && item.priority === task.priority && item.completed === task.completed);

        li.innerHTML = `
            <div class="task-main">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${realIndex}">
                <div>
                    <div class="task-title-row">
                        <p class="task-title">${task.title}</p>
                        <span class="task-badge">${task.category}</span>
                    </div>
                    <p class="task-meta">Priority: ${getPriorityColor(task.priority)} ${task.priority}</p>
                    <p class="task-date">Due: ${task.date || 'No due date'}</p>
                    <p class="task-status">${getStatusBadge(task)}</p>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn complete-btn" data-index="${realIndex}">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn" data-index="${realIndex}" aria-label="Delete task"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function addTask() {
    const title = taskInput.value.trim();
    if (!title) {
        alert('Please enter a task title.');
        return;
    }

    tasks.unshift({
        title,
        category: taskCategory.value,
        date: taskDate.value,
        priority: taskPriority.value,
        completed: false,
    });

    saveTasks();
    taskInput.value = '';
    taskCategory.value = 'Assignment';
    taskDate.value = '';
    taskPriority.value = 'Medium';
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompleted);

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTask();
});

searchInput.addEventListener('input', renderTasks);
filterSelect.addEventListener('change', renderTasks);

taskList.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.delete-btn');
    if (deleteBtn) {
        const index = Number(deleteBtn.dataset.index);
        const confirmDelete = confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
        return;
    }

    const completeBtn = event.target.closest('.complete-btn');
    if (completeBtn) {
        const index = Number(completeBtn.dataset.index);
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
        return;
    }

    const checkbox = event.target.closest('.task-checkbox');
    if (checkbox) {
        const index = Number(checkbox.dataset.index);
        tasks[index].completed = checkbox.checked;
        saveTasks();
        renderTasks();
    }
});

updateDateTime();
setInterval(updateDateTime, 1000);
renderTasks();
