const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const Family = require("../../data/models/Family");

const router = Router();

// @route       POST api/family/id
// @desc        Create new family account
// @access      Public
router.post(
  "/",
  [
    check("familyName", "Family name is required").not().isEmpty(),
    check("email", "Email name is required").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more charecters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // TODO: familyName, email, password
    // WHERE IS IT????

    const { familyName, email, password } = req.body;

    try {
      let family = await Family.findOne({ email });

      if (family) {
        return res
          .status(400)
          .json({ errors: [{ msg: "This family already exists" }] });
      }

      family = new Family({
        familyName,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(42);
      family.password = await bcrypt.hash(password, salt);

      await family.save();

      const payload = {
        family: {
          id: family.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 604800000 },
        (err, token) => {
          if (err) throw err;

          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
