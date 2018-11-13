const express = require("express");
const app = express();
const appConfig = require("./config/main-config.js");
const routeConfig = require("./config/route-config.js");

/* app.use("/", (req, res, next) => {
  res.send("Welcome to Bloccit")
}); */

appConfig.init();
routeConfig.init(app);

module.exports = app;