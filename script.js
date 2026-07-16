/* ==========================================
   TaskFlow Pro
   script.js - Part 1
   Variables, Local Storage, Theme & Helpers
========================================== */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

let searchValue = "";

const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const dueDate = document.getElementById("dueDate");

const addBtn = document.getElementById("addTask");

const taskList = document.getElementById("taskList");

const search = document.getElementById("search");

const filters = document.querySelectorAll(".filter");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const themeToggle = document.getElementById("themeToggle");

const toast = document.getElementById("toast");

const exportBtn = document.getElementById("exportBtn");

const importBtn = document.getElementById("importBtn");

const importFile = document.getElementById("importFile");

const clearCompleted = document.getElementById("clearCompleted");


/* ==========================
   Save Tasks
========================== */

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


/* ==========================
   Toast Notification
========================== */

function showToast(message) {

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ==========================
   Theme
========================== */

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}

themeToggle.onclick = () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeToggle.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

};


/* ==========================
   Format Date
========================== */

function formatDate(date) {

    if (!date) return "No Date";

    const d = new Date(date);

    return d.toLocaleDateString();

}


/* ==========================
   Update Dashboard
========================== */

function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.innerHTML = total;

    completedTasks.innerHTML = completed;

    pendingTasks.innerHTML = pending;

    let percent = 0;

    if (total > 0) {

        percent = Math.round((completed / total) * 100);

    }

    progress.style.width = percent + "%";

    progressText.innerHTML =
        percent + "% Completed";

}


/* ==========================
   Add Task
========================== */

function addTask() {

    if (taskInput.value.trim() === "") {

        showToast("Please enter a task.");

        return;

    }

    const task = {

        id: Date.now(),

        title: taskInput.value,

        priority: priority.value,

        category: category.value,

        dueDate: dueDate.value,

        completed: false,

        pinned: false,

        created: new Date().toISOString()

    };

    tasks.unshift(task);

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("Task Added Successfully");

    taskInput.value = "";

    dueDate.value = "";

}


/* ==========================
   ENTER KEY
========================== */

taskInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        addTask();

    }

});
/* ==========================================
   TaskFlow Pro
   script.js - Part 2
   Render Tasks
========================================== */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    // Search
    if (searchValue !== "") {
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchValue.toLowerCase())
        );
    }

    // Filter
    if (currentFilter === "active") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    // Pinned tasks first
    filteredTasks.sort((a, b) => b.pinned - a.pinned);

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <li class="task-item">
                <div class="task-info">
                    <h3>No Tasks Found</h3>
                    <small>Add a new task to get started.</small>
                </div>
            </li>
        `;

        return;
    }

    filteredTasks.forEach(task => {

        let priorityClass = "";

        switch (task.priority) {

            case "High":
                priorityClass = "high";
                break;

            case "Medium":
                priorityClass = "medium";
                break;

            default:
                priorityClass = "low";

        }

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `

            <div class="left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <div class="task-info">

                    <h3>

                        ${task.pinned ? "📌" : ""}

                        ${task.title}

                    </h3>

                    <small>

                        📂 ${task.category}

                        &nbsp; | &nbsp;

                        📅 ${formatDate(task.dueDate)}

                    </small>

                    <br>

                    <span class="badge ${priorityClass}">
                        ${task.priority}
                    </span>

                </div>

            </div>

            <div class="actions">

                <button
                    class="pin"
                    onclick="pinTask(${task.id})"
                    title="Pin Task">

                    <i class="fa-solid fa-thumbtack"></i>

                </button>

                <button
                    class="edit"
                    onclick="editTask(${task.id})"
                    title="Edit">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="delete"
                    onclick="deleteTask(${task.id})"
                    title="Delete">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;

        taskList.appendChild(li);

    });

}
/* ==========================================
   TaskFlow Pro
   script.js - Part 3
   Complete, Edit, Delete & Pin Tasks
========================================== */

/* ==========================
   Toggle Complete
========================== */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed = !task.completed;

        }

        return task;

    });

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("Task Updated");

}


/* ==========================
   Delete Task
========================== */

function deleteTask(id) {

    if (!confirm("Delete this task?")) {

        return;

    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("Task Deleted");

}


/* ==========================
   Edit Task
========================== */

function editTask(id) {

    const task = tasks.find(t => t.id === id);

    if (!task) return;

    const newTitle = prompt("Edit Task", task.title);

    if (newTitle === null) return;

    if (newTitle.trim() === "") {

        showToast("Task cannot be empty");

        return;

    }

    task.title = newTitle.trim();

    const newPriority = prompt(
        "Priority (High / Medium / Low)",
        task.priority
    );

    if (newPriority) {

        task.priority = newPriority;

    }

    const newCategory = prompt(

        "Category",

        task.category

    );

    if (newCategory) {

        task.category = newCategory;

    }

    saveTasks();

    renderTasks();

    showToast("Task Updated");

}


/* ==========================
   Pin / Unpin Task
========================== */

function pinTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.pinned = !task.pinned;

        }

        return task;

    });

    tasks.sort((a, b) => b.pinned - a.pinned);

    saveTasks();

    renderTasks();

    showToast("Task Updated");

}


/* ==========================
   Clear Completed Tasks
========================== */

clearCompleted.addEventListener("click", () => {

    const completed =

        tasks.filter(task => task.completed);

    if (completed.length === 0) {

        showToast("No completed tasks");

        return;

    }

    if (confirm("Clear completed tasks?")) {

        tasks = tasks.filter(task => !task.completed);

        saveTasks();

        renderTasks();

        updateDashboard();

        showToast("Completed Tasks Removed");

    }

});
/* ==========================================
   TaskFlow Pro
   script.js - Part 4
   Search & Filters
========================================== */

/* ==========================
   Live Search
========================== */

search.addEventListener("keyup", function() {

    searchValue = this.value.trim().toLowerCase();

    renderTasks();

});


/* ==========================
   Filter Buttons
========================== */

filters.forEach(button => {

    button.addEventListener("click", function() {

        // Remove active class
        filters.forEach(btn => btn.classList.remove("active"));

        // Highlight selected filter
        this.classList.add("active");

        // Update current filter
        currentFilter = this.dataset.filter;

        renderTasks();

    });

});


/* ==========================
   Reset Search
========================== */

function clearSearch() {

    search.value = "";

    searchValue = "";

    renderTasks();

}


/* ==========================
   Refresh UI
========================== */

function refreshUI() {

    renderTasks();

    updateDashboard();

}


/* ==========================
   Sort Tasks
========================== */

function sortTasks() {

    tasks.sort((a, b) => {

        // Pinned first
        if (a.pinned !== b.pinned) {

            return b.pinned - a.pinned;

        }

        // Pending first
        if (a.completed !== b.completed) {

            return a.completed - b.completed;

        }

        // Newest first
        return b.id - a.id;

    });

}


/* ==========================
   Refresh after changes
========================== */

function refreshTasks() {

    sortTasks();

    saveTasks();

    refreshUI();

}


/* ==========================
   Keyboard Shortcut
========================== */

document.addEventListener("keydown", function(e) {

    // Ctrl + F focuses search
    if (e.ctrlKey && e.key === "f") {

        e.preventDefault();

        search.focus();

    }

    // Escape clears search
    if (e.key === "Escape") {

        clearSearch();

    }

});


/* ==========================
   Auto Refresh
========================== */

refreshTasks();
/* ==========================================
   TaskFlow Pro
   script.js - Part 5
   Statistics & Progress
========================================== */

/* ==========================
   Calculate Statistics
========================== */

function calculateStats() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    const high = tasks.filter(task => task.priority === "High").length;

    const medium = tasks.filter(task => task.priority === "Medium").length;

    const low = tasks.filter(task => task.priority === "Low").length;

    const today = new Date().toISOString().split("T")[0];

    const dueToday = tasks.filter(task =>

        task.dueDate === today && !task.completed

    ).length;

    const overdue = tasks.filter(task => {

        if (task.completed) return false;

        if (task.dueDate === "") return false;

        return task.dueDate < today;

    }).length;

    return {

        total,
        completed,
        pending,
        high,
        medium,
        low,
        dueToday,
        overdue

    };

}


/* ==========================
   Update Dashboard
========================== */

function updateDashboard() {

    const stats = calculateStats();

    totalTasks.textContent = stats.total;

    completedTasks.textContent = stats.completed;

    pendingTasks.textContent = stats.pending;

    let percent = 0;

    if (stats.total > 0) {

        percent = Math.round(

            (stats.completed / stats.total) * 100

        );

    }

    progress.style.width = percent + "%";

    progressText.innerHTML =

        percent + "% Completed";

}


/* ==========================
   Console Statistics
========================== */

function showStatistics() {

    const stats = calculateStats();

    console.table({

        Total: stats.total,

        Completed: stats.completed,

        Pending: stats.pending,

        High: stats.high,

        Medium: stats.medium,

        Low: stats.low,

        Today: stats.dueToday,

        Overdue: stats.overdue

    });

}


/* ==========================
   Overdue Reminder
========================== */

function overdueReminder() {

    const stats = calculateStats();

    if (stats.overdue > 0) {

        showToast(

            stats.overdue +

            " overdue task(s)"

        );

    }

}


/* ==========================
   Auto Dashboard Refresh
========================== */

function refreshDashboard() {

    updateDashboard();

    showStatistics();

}


/* ==========================
   Run Every Minute
========================== */

setInterval(() => {

    overdueReminder();

}, 60000);
/* ==========================================
   TaskFlow Pro
   script.js - Part 6
   Import & Export Tasks
========================================== */


/* ==========================
   Export Tasks
========================== */

exportBtn.addEventListener("click", () => {

    if (tasks.length === 0) {

        showToast("No tasks to export.");

        return;

    }

    const data = JSON.stringify(tasks, null, 2);

    const blob = new Blob([data], {

        type: "application/json"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "TaskFlow-Pro-Backup.json";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast("Tasks Exported Successfully");

});


/* ==========================
   Import Tasks
========================== */

importBtn.addEventListener("click", () => {

    importFile.click();

});


importFile.addEventListener("change", function() {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {

        try {

            const imported = JSON.parse(event.target.result);

            if (!Array.isArray(imported)) {

                showToast("Invalid backup file.");

                return;

            }

            tasks = imported;

            saveTasks();

            renderTasks();

            updateDashboard();

            showToast("Tasks Imported Successfully");

        } catch (error) {

            console.error(error);

            showToast("Import Failed");

        }

    };

    reader.readAsText(file);

});


/* ==========================
   Backup Information
========================== */

function backupInfo() {

    console.log(

        "TaskFlow Pro Backup",

        new Date().toLocaleString()

    );

}


/* ==========================
   Validate Imported Data
========================== */

function validateTasks(list) {

    return list.every(task => {

        return (

            task.id !== undefined &&

            task.title !== undefined &&

            task.priority !== undefined &&

            task.category !== undefined &&

            task.completed !== undefined

        );

    });

}


/* ==========================
   Safe Import
========================== */

function safeImport(list) {

    if (!validateTasks(list)) {

        showToast("Invalid Task File");

        return false;

    }

    tasks = list;

    saveTasks();

    renderTasks();

    updateDashboard();

    return true;

}
/* ==========================================
   TaskFlow Pro
   script.js - Part 7
   Sorting, Pinning & Due Date Utilities
==========================================*/

/* ==========================
   Priority Score
========================== */

function priorityValue(priority) {

    switch (priority) {

        case "High":
            return 3;

        case "Medium":
            return 2;

        case "Low":
            return 1;

        default:
            return 0;

    }

}


/* ==========================
   Sort by Priority
========================== */

function sortByPriority() {

    tasks.sort((a, b) => {

        return priorityValue(b.priority) -

            priorityValue(a.priority);

    });

    saveTasks();

    renderTasks();

}


/* ==========================
   Sort by Due Date
========================== */

function sortByDueDate() {

    tasks.sort((a, b) => {

        if (a.dueDate === "" && b.dueDate === "") return 0;

        if (a.dueDate === "") return 1;

        if (b.dueDate === "") return -1;

        return new Date(a.dueDate) - new Date(b.dueDate);

    });

    saveTasks();

    renderTasks();

}


/* ==========================
   Sort Alphabetically
========================== */

function sortAlphabetically() {

    tasks.sort((a, b) => {

        return a.title.localeCompare(b.title);

    });

    saveTasks();

    renderTasks();

}


/* ==========================
   Today's Tasks
========================== */

function getTodayTasks() {

    const today = new Date().toISOString().split("T")[0];

    return tasks.filter(task => {

        return task.dueDate === today &&
            !task.completed;

    });

}


/* ==========================
   Overdue Tasks
========================== */

function getOverdueTasks() {

    const today = new Date().toISOString().split("T")[0];

    return tasks.filter(task => {

        return task.dueDate &&
            task.dueDate < today &&
            !task.completed;

    });

}


/* ==========================
   Highlight Due Dates
========================== */

function highlightDueDates() {

    const overdue = getOverdueTasks();

    if (overdue.length > 0) {

        console.log(

            "Overdue Tasks:",

            overdue

        );

    }

}


/* ==========================
   Auto Sort
========================== */

function autoSort() {

    tasks.sort((a, b) => {

        // Pinned first
        if (a.pinned !== b.pinned) {

            return b.pinned - a.pinned;

        }

        // High priority first
        if (priorityValue(a.priority) !==
            priorityValue(b.priority)) {

            return priorityValue(b.priority) -
                priorityValue(a.priority);

        }

        // Earliest due date first
        if (a.dueDate && b.dueDate) {

            return new Date(a.dueDate) -
                new Date(b.dueDate);

        }

        return b.id - a.id;

    });

}


/* ==========================
   Refresh & Save
========================== */

function refreshAll() {

    autoSort();

    saveTasks();

    renderTasks();

    updateDashboard();

}
/* ==========================================
   TaskFlow Pro
   script.js - Part 8
   App Initialization & Startup
========================================== */

/* ==========================
   INITIAL LOAD
========================== */
function initApp() {

    // Load theme state safely
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    // Ensure tasks array is valid
    if (!Array.isArray(tasks)) {
        tasks = [];
    }

    // First render
    autoSort();
    saveTasks();
    renderTasks();
    updateDashboard();

    // Show welcome message only first time
    if (!localStorage.getItem("visited")) {
        showToast("Welcome to TaskFlow Pro 🚀");
        localStorage.setItem("visited", "true");
    }
}


/* ==========================
   EVENT BINDING (CLEAN STARTUP)
========================== */
function bindEvents() {

    // Add Task button
    addBtn.addEventListener("click", addTask);

    // Enter key support already exists, but reinforce safety
    taskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTask();
    });

    // Clear completed
    clearCompleted.addEventListener("click", () => {
        const completed = tasks.filter(t => t.completed);

        if (completed.length === 0) {
            showToast("No completed tasks");
            return;
        }

        if (confirm("Clear completed tasks?")) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            renderTasks();
            updateDashboard();
            showToast("Completed tasks cleared");
        }
    });

    // Export
    exportBtn.addEventListener("click", () => {
        if (tasks.length === 0) {
            showToast("No tasks to export");
            return;
        }

        const blob = new Blob(
            [JSON.stringify(tasks, null, 2)], { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "taskflow-backup.json";
        a.click();

        URL.revokeObjectURL(url);
        showToast("Exported successfully");
    });

    // Import
    importBtn.addEventListener("click", () => importFile.click());

    importFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (!Array.isArray(data)) {
                    showToast("Invalid file");
                    return;
                }

                tasks = data;

                saveTasks();
                renderTasks();
                updateDashboard();

                showToast("Imported successfully");

            } catch (err) {
                console.error(err);
                showToast("Import failed");
            }
        };

        reader.readAsText(file);
    });

    // Keyboard shortcuts (final polish)
    document.addEventListener("keydown", (e) => {

        // Ctrl + F focuses search
        if (e.ctrlKey && e.key === "f") {
            e.preventDefault();
            search.focus();
        }

        // Escape clears search
        if (e.key === "Escape") {
            clearSearch();
        }
    });
}


/* ==========================
   SAFE UTILITIES
========================== */
function safeRender() {
    try {
        renderTasks();
    } catch (e) {
        console.error("Render error:", e);
    }
}

function safeUpdate() {
    try {
        updateDashboard();
    } catch (e) {
        console.error("Dashboard error:", e);
    }
}


/* ==========================
   FINAL STARTUP ENTRY POINT
========================== */
document.addEventListener("DOMContentLoaded", () => {

    initApp();
    bindEvents();

    // Final safety render
    safeRender();
    safeUpdate();

    console.log("TaskFlow Pro initialized successfully 🚀");
});