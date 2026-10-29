// Find the HTML elements we need
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskSubjectInput = document.getElementById("task-subject");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const formMessage = document.getElementById("form-message");

// Load previously saved tasks from the browser
let tasks = [];

try {
    const savedTasks = localStorage.getItem("atu-study-tasks");
    tasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
}

// Save the current tasks
function saveTasks() {
    try {
        localStorage.setItem("atu-study-tasks", JSON.stringify(tasks));
    } catch (error) {
        formMessage.textContent =
            "Your tasks could not be saved in this browser.";
    }
}

// Display all tasks on the page
function displayTasks() {
    taskList.replaceChildren();

    // Show the empty message only when there are no tasks
    emptyState.hidden = tasks.length > 0;

    tasks.forEach(function (task) {
        // Create a task row
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Create the completion checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.title + " as complete"
        );

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        // Create the task details
        const details = document.createElement("div");
        details.className = "task-details";

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        const subject = document.createElement("span");
        subject.className = "task-subject";
        subject.textContent = task.subject;

        details.append(title, subject);

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            "Delete " + task.title
        );

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });

        // Put the elements together
        listItem.append(checkbox, details, deleteButton);
        taskList.appendChild(listItem);
    });
}

// Handle the Add Task form
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskTitleInput.value.trim();
    const subject = taskSubjectInput.value.trim();

    // Do not allow blank titles or subjects
    if (title === "" || subject === "") {
        formMessage.textContent =
            "Please enter both a task title and a subject or course.";
        return;
    }

    // Create the new task
    const newTask = {
        id: Date.now(),
        title: title,
        subject: subject,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    // Clear the form for the next task
    taskForm.reset();
    formMessage.textContent = "";
    taskTitleInput.focus();
});

// Clear an old validation message when the user edits the form
taskForm.addEventListener("input", function () {
    formMessage.textContent = "";
});

// Display saved tasks when the page first opens
displayTasks();