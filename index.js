const express = require("express");
const path = require("path");

const routes = require("./api/routes/index");
const connectDB = require("./config/db");

const app = express();
connectDB();

// middleware for req.body
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("api is running!!!");
});
routes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
