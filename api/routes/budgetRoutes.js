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
  [
    check("name", "Budget name is required").not().isEmpty(),
    check("total", "Enter correct summ").isNumeric(),
    authMiddleware,
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, total } = req.body;

    try {
      const budget = new Budget({ name, total, family: req.family.id });

      await budget.save();

      res.json(budget);
    } catch (error) {
      console.log(error.message);

      res.status(500).send("Server Error");
    }
  }
);

// @route       GET api/budget/all
// @desc        Get all IDs of budgets for current family
// @access      Private
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const budgets = await (
      await Budget.find()
    ).filter((budget) => budget.family.toString() === req.family.id.toString());

    if (!budgets || budgets.length === 0)
      return res.status(404).json({ msg: "Bugets not found" });

    const result = budgets.map((budget) => ({
      id: budget._id,
      name: budget.name,
    }));

    res.send(result);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("Server Error");
  }
});

// @route       GET api/budget/:id
// @desc        Get budget by id
// @access      Private

//TODO: check if family.id === budget.family

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) return res.status(404).json({ msg: "Budget not found" });

    res.send(budget);
  } catch (error) {
    console.log(error.message);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Budget not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route       PATCH api/budget/:id
// @desc        Add transaction to budget
// @access      Private

// TODO:
// money - not a number
// no name
// if family id different with budget.family
// if :id is incorrect and budget not found
// if you have invalid token
// if person is not exist in family
// and think about another tests!!!

router.patch(
  "/:id",
  [
    check("money", "Enter Correct summ").isNumeric(),
    check("name", "Person name is required").not().isEmpty(),
    authMiddleware,
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { money, name } = req.body;

    try {
      const budget = await Budget.findById(req.params.id);

      if (!budget) return res.status(404).json({ msg: "Budget not found" });

      const family = await Family.findById(req.family.id).select("-password");

      if (family._id.toString() !== budget.family.toString())
        return res.status(401).json({ msg: "Token is not valid" });

      if (family.persons.find((person) => person.name === name)) {
        budget.transactions.push({ person: name, money });

        await budget.save();

        res.send(budget);
      } else {
        return res
          .status(404)
          .json({ errors: [{ msg: "This person not found" }] });
      }
    } catch (error) {
      console.log(error.message);

      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Budget not found" });
      }

      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
