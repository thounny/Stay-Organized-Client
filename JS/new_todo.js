document.addEventListener("DOMContentLoaded", async () => {
    const users = await fetchUsers();
    const categories = await fetchCategories();
  
    const userDropdown = document.getElementById("userDropdown");
    const categoryDropdown = document.getElementById("categoryDropdown");
  
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      userDropdown.appendChild(option);
    });
  
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      categoryDropdown.appendChild(option);
    });
  
    document
      .getElementById("newTodoForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const todo = {
          userid: userDropdown.value,
          category: categoryDropdown.value,
          description: document.getElementById("description").value,
          deadline: document.getElementById("deadline").value,
          priority: document.getElementById("priorityDropdown").value,
        };
        const response = await addTodo(todo);
        if (response.ok) {
          alert("ToDo added successfully!");
        } else {
          alert("Failed to add ToDo.");
        }
      });
  });