const { Router } = require("express");
const jwt = require("jsonwebtoken");
const brcypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const authMiddleware = require("../middlewares/authMiddleware");

const Family = require("../../data/models/Family");

const router = Router();

// @route       GET api/login
// @desc        Get account from database
// @access      Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const family = await Family.findById(req.family.id).select("-password");

    res.json(family);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("Server Error");
  }
});

// @route       POST api/login
// @desc        Account login
// @access      Public
router.post(
  "/",
  [
    check("email", "Correct email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let family = await Family.findOne({ email });

      if (!family) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      const isPasswordMatch = await brcypt.compare(password, family.password);

      if (!isPasswordMatch) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      const payload = {
        family: {
          id: family.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
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
