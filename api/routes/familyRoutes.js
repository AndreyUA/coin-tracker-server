const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const authMiddleware = require("../middlewares/authMiddleware");

const Family = require("../../data/models/Family");

const router = Router();

// @route       PATCH api/family
// @desc        Add person to family
// @access      Private
router.patch(
  "/",
  [authMiddleware, check("name", "Person name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      const family = await Family.findById(req.family.id).select("-password");

      if (family.persons.find((person) => person.name === name))
        return res
          .status(400)
          .json({ errors: [{ msg: "This person already exists" }] });

      const newPerson = {
        name,
      };

      family.persons.push(newPerson);

      await family.save();

      res.json(family);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route       DELETE api/family
// @desc        Add person to family
// @access      Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const family = await Family.findById(req.family.id).select("-password");
    const indexPerson = family.persons.findIndex(
      (person) => JSON.stringify(person._id) === JSON.stringify(req.params.id)
    );

    if (+indexPerson === -1)
      return res
        .status(400)
        .json({ errors: [{ msg: "This person is not exists" }] });

    family.persons.splice(indexPerson, 1);

    await family.save();

    res.json(family);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
