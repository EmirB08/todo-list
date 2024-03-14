document
	.getElementById("todo-form")
	.addEventListener("submit", async (event) => {
		event.preventDefault();
		const titleInput = document.getElementById("new-todo-title");
		const title = titleInput.value.trim();
		if (title) {
			await addTodo(title);
			titleInput.value = "";
		}
	});

const addTodo = async (title) => {
	try {
		await fetch("http://localhost:3000/todos", {
			// POST
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title, completed: false }),
		});
		await fetchTodos();
	} catch (error) {
		console.error("Error adding todo:", error);
	}
};

const fetchTodos = async () => {
	// GET
	try {
		const response = await fetch("http://localhost:3000/todos");
		const todos = await response.json();
		displayTodos(todos);
	} catch (error) {
		console.error("Error fetching todos:", error);
	}
};

const displayTodos = (todos) => {
	const todoList = document.getElementById("todo-list");
	todoList.innerHTML = "";

	todos.forEach((todo) => {
		const li = document.createElement("li");
		li.textContent = todo.title;

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Delete";
		deleteButton.classList.add(
			"px-4",
			"py-2",
			"text-sm",
			"text-white",
			"bg-red-500",
			"hover:bg-red-600",
			"rounded"
		);
		deleteButton.addEventListener("click", () => deleteTodo(todo._id));
		li.appendChild(deleteButton);

		const updateButton = document.createElement("button");
		updateButton.textContent = todo.completed ? "Incomplete" : "Complete";
		updateButton.addEventListener("click", () =>
			updateTodo(todo._id, !todo.completed)
		);
		li.appendChild(updateButton);

		todoList.appendChild(li);
	});
};

const deleteTodo = async (id) => {
	// DELETE
	try {
		await fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" });
		await fetchTodos();
	} catch (error) {
		console.error("Error deleting todo:", error);
	}
};

const updateTodo = async (id, completed) => {
	// PUT
	try {
		await fetch(`http://localhost:3000/todos/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ completed }),
		});
		await fetchTodos();
	} catch (error) {
		console.error("Error updating todo:", error);
	}
};

fetchTodos();
