document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded triggered...");

  const dropdown = document.getElementById("userDropdown");

  // Populate user dropdown ONCE during page load
  await populateUserDropdown(dropdown);

  // Add event listener for "Load ToDos" button
  document
    .getElementById("loadTodosBtn")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("Load ToDos button clicked.");
      await loadTodos();
    });
});

// Populate the user dropdown (called only once)
async function populateUserDropdown(dropdown) {
  console.trace("populateUserDropdown called...");
  if (dropdown.dataset.populated === "true") {
    console.log("Dropdown already populated, skipping...");
    return;
  }

  try {
    console.log("Fetching users...");
    const users = await fetchUsers(); // Fetch users from the API

    dropdown.innerHTML = '<option value="" disabled>Select a user</option>'; // Clear existing options
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      dropdown.appendChild(option);
    });

    dropdown.dataset.populated = "true"; // Mark as populated
  } catch (error) {
    console.error("Failed to populate user dropdown:", error);
  }
}

// Function to load ToDos for the selected user
async function loadTodos() {
  console.log("Function loadTodos called...");
  const dropdown = document.getElementById("userDropdown");
  const userId = dropdown.value;

  if (!userId) {
    alert("Please select a user to view their ToDos.");
    return;
  }

  try {
    console.log("Fetching todos for user ID:", userId);
    const todos = await fetchTodosByUser(userId);

    const tableBody = document.querySelector("#todoTable tbody");
    tableBody.innerHTML = ""; // Clear the table

    todos.forEach((todo) => {
      const row = createTodoRow(todo);
      tableBody.appendChild(row);
    });

    attachRowButtonListeners(); // Attach listeners to new rows
  } catch (error) {
    console.error("Failed to load ToDos:", error);
  }
}

// Function to create a table row for a ToDo
function createTodoRow(todo) {
  const row = document.createElement("tr");
  row.setAttribute("data-id", todo.id); // Assign the ToDo ID to the row

  row.innerHTML = `
    <td>${todo.description}</td>
    <td>${todo.deadline}</td>
    <td>${todo.priority}</td>
    <td class="completion-status">${todo.completed ? "✔️" : "❌"}</td>
    <td>
      <button type="button" class="complete-btn">${
        todo.completed ? "Undo" : "Complete"
      }</button>
      <button type="button" class="delete-btn">Delete</button>
    </td>`;
  return row;
}

// Attach event listeners to buttons
function attachRowButtonListeners() {
  console.log("attachRowButtonListeners called...");
  const completeButtons = document.querySelectorAll(".complete-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  completeButtons.forEach((button) => {
    button.removeEventListener("click", handleComplete);
    button.addEventListener("click", handleComplete);
  });

  deleteButtons.forEach((button) => {
    button.removeEventListener("click", handleDelete);
    button.addEventListener("click", handleDelete);
  });
}

// Handle Complete/Undo action
async function handleComplete(event) {
  console.log("handleComplete triggered...");
  event.preventDefault();
  event.stopPropagation();

  const button = event.target;
  const row = button.closest("tr");
  const completionCell = row.querySelector(".completion-status");

  const todoId = row.getAttribute("data-id");
  if (!todoId) {
    console.error("ToDo ID is missing!");
    return;
  }

  const currentStatus = completionCell.textContent === "✔️";

  try {
    const response = await fetch(`http://localhost:8083/api/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentStatus }),
    });

    if (response.ok) {
      completionCell.textContent = !currentStatus ? "✔️" : "❌";
      button.textContent = !currentStatus ? "Undo" : "Complete";
    } else {
      console.error("Failed to update task status.");
    }
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

// Handle Delete action
async function handleDelete(event) {
  console.log("handleDelete triggered...");
  event.preventDefault();
  event.stopPropagation();

  const button = event.target;
  const row = button.closest("tr");

  const todoId = row.getAttribute("data-id");
  if (!todoId) {
    console.error("ToDo ID is missing!");
    return;
  }

  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (confirmDelete) {
    try {
      const response = await fetch(
        `http://localhost:8083/api/todos/${todoId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        row.remove(); // Remove only this row
      } else {
        console.error("Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
}
