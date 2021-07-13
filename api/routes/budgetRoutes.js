const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const authMiddleware = require("../middlewares/authMiddleware");

const Budget = require("../../data/models/Budget");

const router = Router();

// @route       POST api/budget
// @desc        Create new budget
// @access      Private
router.post(
  "/",
  authMiddleware,
  [check("total", "Enter correct summ").isNumeric()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { total } = req.body;

    try {
      const budget = new Budget({ total });

      await budget.save();

      res.json(budget);
    } catch (error) {
      console.log(error.message);

      res.status(500).send("Server Error");
    }
  }
);

// @route       GET api/budget
// @desc        Get budget y id
// @access      Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) return res.status(400).json({ msg: "Budget not found" });

    res.send(budget);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("Server Error");
  }
});

module.exports = router;
