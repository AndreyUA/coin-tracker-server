const registerRoutes = require("./registerRoutes");
const loginRoutes = require("./loginRoutes");
const budgetRoutes = require("./budgetRoutes");

module.exports = (app) => {
  app.use("/api/register", registerRoutes);
  app.use("/api/login", loginRoutes);
  app.use("/api/budget", budgetRoutes);
};
