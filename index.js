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
const Post = require('./data/models/Post');

const socketIo = io(server, {
  cors: {
    origins: [process.env.CLIENT_URL],
  },
});

socketIo.on("connection", (socket) => {
  console.log("new client connected, id:", socket.id);

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });

  // Join to family room
  socket.on('join_family_channel', (roomId) => {
    socket.join(roomId);
  });

  // Send private post to your room
  socket.on("sendPost", async (familyId, msg) => {
    const { name, text } = msg;

    try {
      const post = new Post({ name, text, family: familyId });

      await post.save();

      socket.to(familyId).emit("receivePost", post);
    } catch (error) {
      console.log(error);

      // TODO: add error message to user
    }
  });
});
