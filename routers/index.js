const userRoute = require("./users");
const loginRoute = require("./login");
const questionRoute = require("./questions");
const sectionsRoute = require("./sections");
const unitsRoute = require("./units");
const quizRoute = require("./quiz");
module.exports = (app) => {
  app.use("/", loginRoute);
  app.use("/users", userRoute);
  app.use("/questions", questionRoute);
  app.use("/sections", sectionsRoute);
  app.use("/units", unitsRoute);
  app.use("/quiz", quizRoute);
};
