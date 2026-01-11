import express from "express";
const app = express();
import { init as initAppConfig } from "./config/main-config.js";
import { init as initRouteConfig } from "./config/route-config.js";

initAppConfig(app, express);
await initRouteConfig(app);

export default app;