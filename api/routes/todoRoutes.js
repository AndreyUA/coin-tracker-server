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
          new Date(todoB.date).getTime() - new Date(todoA.date).getTime()
      )
      .filter((post) => !post.isRemoved);

    if (!todoList || todoList.length === 0)
      return res.status(404).json({ errors: [{ msg: "Todos not found" }] });

    res.send(todoList);
  } catch (error) {
    console.log(error);

    res.status(500).send("Server error");
  }
});

// @route       POST api/todo
// @desc        Create new todo
// @access      Private
router.post(
  "/",
  [
    check("content", "Text content is required").not().isEmpty(),
    authMiddleware,
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    try {
      const todo = new Todo({ content, family: req.family.id });

      await todo.save();

      res.json(todo);
    } catch (error) {
      console.log(error);

      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
