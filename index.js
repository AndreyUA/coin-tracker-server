const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

const routes = require("./api/routes/index");
const connectDB = require("./config/db");

// Apply .env
dotenv.config();

// Create app
const app = express();
// Connect to database
connectDB();

// Middleware for req.body
app.use(express.json({ extended: false }));

// CORS for requests
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("api is running!!!");
});
routes(app);

// Server port number
const PORT = process.env.PORT;

// Start
app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
