import { createUser, getUser } from "../db/queries.users.js";
import { authenticate } from "passport";

export function signUp(req, res, next) {
  res.render("users/sign_up");
}
export function create(req, res, next) {
  let newUser = {
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  };

  createUser(newUser, (err, user) => {
    if (err) {
      req.flash("error", err);
      res.redirect("/users/sign_up");
    } else {
      authenticate("local")(req, res, () => {
        req.flash("notice", "You've successfully created an account!");
        res.redirect("/");
      });
    }
  });
}
export function signInForm(req, res, next) {
  res.render("users/sign_in");
}
export function signIn(req, res, next) {
  authenticate("local")(req, res, () => {
    if (!req.user) {
      req.flash("notice", "Sign in failed. Please try again.");
      res.redirect("/users/sign_in");
    } else {
      req.flash("notice", "You've successfully signed in!");
      res.redirect("/topics/");
    }
  });
}
export function signOut(req, res, next) {
  req.logout();
  req.flash("notice", "You've successfully signed out!");
  res.redirect("/");
}
export function show(req, res, next) {
  getUser(req.params.id, (err, result) => {
    if (err || result.user === undefined) {
      req.flash("notice", "No user found with that ID.");
      res.redirect("/");
    } else {
      res.render("users/show", { ...result });
    }
  });
}