const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const authMiddleware = require("../middlewares/authMiddleware");

const Todo = require("../../data/models/Todo");

const router = Router();

// @route       GET api/todo/all
// @desc        Get all todo list
// @access      Private


// TODO: test it!
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const todoList = await (
      await Todo.find()
    )
      .filter((post) => post.family.toString() === req.family.id.toString())
      .sort(
        (todoA, todoB) =>
          new Date(todoA.date).getTime() - new Date(todoB.date).getTime()
      )
      .filter((post) => !post.isRemoved);

    if (!todoList || todoList.length === 0)
      return res.status(404).json({ msg: "Todos not found" });

    res.send(todoList);
  } catch (error) {
    console.log(error);

    res.status(500).send("Server error");
  }
});

module.exports = router;
