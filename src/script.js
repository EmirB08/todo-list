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
		li.classList.add(
			"flex",
			"justify-between",
			"items-center",
			"p-2",
			"bg-white",
			"rounded",
			"mb-2"
		);

		const textSpan = document.createElement("span");
		textSpan.textContent = todo.title;
		li.appendChild(textSpan);

		const buttonsContainer = document.createElement("div");

		const updateButton = document.createElement("button");
		updateButton.textContent = todo.completed ? "Done" : "In Progress"; // Switched the text
		updateButton.classList.add("px-2", "py-1", "text-sm", "rounded");
		if (!todo.completed) {
			updateButton.classList.add(
				"bg-yellow-500",
				"hover:bg-yellow-600",
				"text-white"
			);
		} else {
			updateButton.classList.add(
				"bg-green-700",
				"hover:bg-green-800",
				"text-white"
			);
		}

		updateButton.addEventListener("click", () =>
			updateTodo(todo._id, !todo.completed)
		);
		buttonsContainer.appendChild(updateButton);

		li.appendChild(buttonsContainer);

		todoList.appendChild(li);

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "DEL";
		deleteButton.classList.add(
			"px-2",
			"py-1",
			"ml-2",
			"text-sm",
			"text-white",
			"bg-red-700",
			"hover:bg-red-800",
			"rounded",
			"mr-2"
		);
		deleteButton.addEventListener("click", () => deleteTodo(todo._id));
		buttonsContainer.appendChild(deleteButton);
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
