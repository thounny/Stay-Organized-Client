const API_BASE = "http://localhost:8083/api";

async function fetchUsers() {
  const response = await fetch(`${API_BASE}/users`);
  return response.json();
}

async function fetchTodosByUser(userId) {
  const response = await fetch(`${API_BASE}/todos/byuser/${userId}`);
  return response.json();
}

async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories`);
  return response.json();
}

async function addTodo(todo) {
  const response = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  return response;
}

async function deleteTodo(id) {
  const response = await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
  return response;
}

async function updateTodo(id, updatedFields) {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedFields),
  });
  return response;
}