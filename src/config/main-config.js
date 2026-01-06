import { join, dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import session from "express-session";
import flash from "express-flash";
import helmet from "helmet";
import { init as _init } from "./passport-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewsFolder = join(__dirname, "..", "views");

export function init(app, express) {
  app.use(helmet());
  app.set("views", viewsFolder);
  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(join(__dirname, "..", "assets")));
  // app.use(expressValidator()); // Deprecated in express-validator v6+
  app.use(session({
    secret: process.env.cookieSecret || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1210000000 }
  }));
  app.use(flash());
  _init(app);

  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
  });
}