const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// APP INIT
const app = express();
app.use(express.json());
app.use(express.static("public"));

// ROUTES
const movieRoutes = require("./routes/movieRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // 👈 ВОТ ТУТ

// ROUTES MIDDLEWARE
app.use("/movies", movieRoutes);
app.use("/reviews", reviewRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes); // 👈 И ВОТ ТУТ

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Assignment 4 API is running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
