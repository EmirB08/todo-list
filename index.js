require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
