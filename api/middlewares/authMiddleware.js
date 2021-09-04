const jwt = require("jsonwebtoken");

// middleware for token check
module.exports = function (req, res, next) {
  //get token from header
  const token = req.header("Authorization").slice(7);

  //check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.family = decoded.family;

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
