import { createUser, getUser } from "../db/queries.users.js";
import passport from "passport";

export function signUp(req, res, next) {
  res.render("users/sign_up");
}
export async function create(req, res, next) {
  let newUser = {
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  };

  try {
    const user = await createUser(newUser);
    passport.authenticate("local")(req, res, () => {
      req.flash("notice", "You've successfully created an account!");
      res.redirect(303, "/");
    });
  } catch (err) {
    req.flash("error", err);
    res.redirect(500,"/users/sign_up");
  }
}

export function signInForm(req, res, next) {
  res.render("users/sign_in");
}

export function signIn(req, res, next) {
  passport.authenticate("local")(req, res, () => {
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
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  });
}

export async function show(req, res, next) {
  try {
    const result = await getUser(req.params.id);
    if (result.user === undefined) {
      req.flash("notice", "No user found with that ID.");
      res.redirect("/");
    } else {
      res.render("users/show", { ...result });
    }
  } catch (err) {
    req.flash("notice", "No user found with that ID.");
    res.redirect("/");
  }
}