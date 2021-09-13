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
const Post = require("./data/models/Post");
const Todo = require("./data/models/Todo");

const socketIo = io(server, {
  cors: {
    origins: ["*"],
  },
});

socketIo.on("connection", (socket) => {
  console.log("new client connected, id:", socket.id);

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });

  // Join to family room
  socket.on("join_family_channel", (roomId) => {
    socket.join(roomId);
  });

  // Send private post to your room
  socket.on("sendPost", async (familyId, msg) => {
    // TODO: validate name and text ---> not empty strings
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

  socket.on("removePost", async (familyId, msgId) => {
    socket.to(familyId).emit("receiveDeletedPost", msgId);
  });

  socket.on("updateTodosList", async (familyId, todo) => {
    // TODO: Validate content is not empty
    const { content } = todo;

    try {
      const newTodo = new Todo({ content, family: familyId });

      await newTodo.save();

      socket.to(familyId).emit("updateTodos", newTodo);
    } catch (error) {
      console.log(error);

      // TODO: add error message to user
    }
  });

  socket.on("changeTodoStatus", async (familyId, todoId) => {
    // TODO: Validate todoId is not empty
    try {
    // TODO: Validate todo is exist
    const todo = await Todo.findById(todoId);

    todo.isFinished = !todo.isFinished,

    await todo.save();

    socket.to(familyId).emit("updateTodos", todo);
    } catch (error) {
      console.log(error);

      // TODO: add error message to user
    }
  });

  socket.on("deleteTodoStatus", async (familyId, todoId) => {
    // TODO: Validate todoId is not empty
    try {
    // TODO: Validate todo is exist
    const todo = await Todo.findById(todoId);

    todo.isRemoved = true,

    await todo.save();

    socket.to(familyId).emit("updateTodos", todo);
    } catch (error) {
      console.log(error);

      // TODO: add error message to user
    }
  });
});

// TODO: refactor it
// with https://coderoad.ru/25119541/%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-socket-io-%D0%B2-%D1%81%D0%BE%D1%87%D0%B5%D1%82%D0%B0%D0%BD%D0%B8%D0%B8-%D1%81-express
