const familyRoutes = require("./familyRoutes");

module.exports = (app) => {
  app.use("/api/family", familyRoutes);
};
