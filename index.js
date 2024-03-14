require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static("src")); // route to static files

mongoose // Connection to MongoDB Atlas
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("MongoDB connected!"))
	.catch((err) => console.error("MongoDB connection error:", err));

const TodoSchema = new mongoose.Schema( // mongoDB schema
	{
		title: {
			type: String,
			required: true,
            minlength: 3,
		},
		completed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Todo = mongoose.model("Todo", TodoSchema);

app.get("/", (req, res) => {
	res.send("Todo app");
});

app.post("/todos", async (req, res) => { //CREATE
	try {
		const todo = new Todo(req.body);
		const result = await todo.save();
		res.status(201).json(result);
	} catch (err) {
		res.status(400).json({ message: "Error POST", error: err });
	}
});

app.get("/todos", async (req, res) => { //READ
	try {
		const todos = await Todo.find();
		res.status(200).json(todos);
	} catch (err) {
		res.status(500).json({ message: "Error GET", error: err });
	}
});

app.put("/todos/:id", async (req, res) => { //UPDATE
	try {
		const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.status(200).json(updatedTodo);
	} catch (err) {
		res.status(400).json({ message: "Error PUT", error: err });
	}
});

app.delete("/todos/:id", async (req, res) => { //DELETE
	try {
		await Todo.findByIdAndDelete(req.params.id);
		res
			.status(200)
			.json({ message: "Todo deleted successfully", id: req.params.id });
	} catch (err) {
		res.status(500).json({ message: "Error DELETE", error: err });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
