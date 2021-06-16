const express = require("express");
const path = require("path");

const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("api is running!!!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
