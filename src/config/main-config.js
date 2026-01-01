import { join } from "path";
import { urlencoded } from "body-parser";
import expressValidator from "express-validator";
import session from "express-session";
import flash from "express-flash";
import { init as _init } from "./passport-config";
const viewsFolder = join(__dirname, "..", "views");

export function init(app, express) {
  app.set("views", viewsFolder);
  app.set("view engine", "ejs");
  app.use(urlencoded({ extended: true }));
  app.use(express.static(join(__dirname, "..", "assets")));
  app.use(expressValidator());
  app.use(session({
    secret: process.env.cookieSecret,
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