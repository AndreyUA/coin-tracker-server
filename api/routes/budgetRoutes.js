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
      const budget = new Budget({ total, family: req.family.id });

      await budget.save();

      res.json(budget);
    } catch (error) {
      console.log(error.message);

      res.status(500).send("Server Error");
    }
  }
);

// @route       GET api/budget/all
// @desc        Get all budgets for current family
// @access      Private
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const budgets = await (
      await Budget.find()
    ).filter((budget) => budget.family.toString() === req.family.id.toString());

    if (!budgets || budgets.length === 0)
      return res.status(404).json({ msg: "Bugets not found" });

    res.send(budgets);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("Server Error");
  }
});

// @route       GET api/budget/:id
// @desc        Get budget y id
// @access      Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    // TODO: failed if id not correct!
    if (!budget) return res.status(400).json({ msg: "Budget not found" });

    res.send(budget);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("Server Error");
  }
});

module.exports = router;
