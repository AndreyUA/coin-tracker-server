const { Router } = require("express");
const jwt = require("jsonwebtoken");
const brcypt = require("bcryptjs");
const config = require("config");
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

module.exports = router;
