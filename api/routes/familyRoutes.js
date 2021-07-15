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

    // TODO: check if this name already exist

    const { name } = req.body;

    try {
      const family = await Family.findById(req.family.id).select("-password");

      const newPerson = {
        name,
      };

      family.persons.push(newPerson);

      await family.save();

      res.json(family);
    } catch (error) {}
  }
);

module.exports = router;
