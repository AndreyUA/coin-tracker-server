const express = require("express");
const path = require("path");

const routes = require("./api/routes/index");
const connectDB = require("./config/db");

// Create app
const app = express();
// Connect to database
connectDB();

// Middleware for req.body
app.use(express.json({ extended: false }));

// CORS for requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("api is running!!!");
});
routes(app);

// Server port number
const PORT = process.env.PORT || 5000;

// Start
app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
