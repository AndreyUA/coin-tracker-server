const registerRoutes = require("./registerRoutes");
const loginRoutes = require("./loginRoutes");

module.exports = (app) => {
  app.use("/api/register", registerRoutes);
  app.use("/api/login", loginRoutes);
};
