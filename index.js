const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const io = require("socket.io");

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

// Start server
const server = app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Socket.io
const socketIo = io(server, {
  cors: {
    origins: [process.env.CLIENT_URL],
  },
});

socketIo.on("connection", (socket) => {
  console.log("new client connected");

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });

  socket.on("sendPost", (msg) => {
    // TODO: add logic for extract message from DB and send it to CORRECT user
    socketIo.emit("receivePost", `server: ${JSON.stringify(msg)}`);
  });
});
