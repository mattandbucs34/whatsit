const express = require("express");
const app = express();
const routeConfig = require("./config/route-config");

/* app.use("/", (req, res, next) => {
  res.send("Welcome to Bloccit")
}); */

routeConfig.init(app);

module.exports = app;