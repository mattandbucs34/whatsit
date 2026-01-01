import express from "express";
const app = express();
import appConfig from "./config/main-config.js";
import routeConfig from "./config/route-config.js";

/* app.use("/", (req, res, next) => {
  res.send("Welcome to Bloccit")
}); */

appConfig.init(app, express);
routeConfig.init(app);

export default app;