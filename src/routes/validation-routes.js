import { check, validationResult } from "express-validator";

export async function validatePosts(req, res, next) {
  if (req.method === "POST") {
    await check("topicId", "must be valid").notEmpty().isInt().run(req);
    await check("title", "must be at least 2 characters in length").isLength({ min: 2 }).run(req);
    await check("body", "must be at least 10 characters in length").isLength({ min: 10 }).run(req);
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("error", errors.array());
    return res.redirect(303, req.headers.referer);
  } else {
    return next();
  }
}

export async function validateTopics(req, res, next) {
  if (req.method === "POST") {
    await check("title", "must be at least 5 characters long").isLength({ min: 5 }).run(req);
    await check("description", "must be at least 10 characters long").isLength({ min: 10 }).run(req);
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("error", errors.array());
    return res.redirect(303, req.headers.referer);
  } else {
    return next();
  }
}

export async function validateUsers(req, res, next) {
  if (req.method === "POST") {
    await check("email", "must be valid").isEmail().run(req);
    await check("password", "must be at least 6 characters in length").isLength({ min: 6 }).run(req);
    await check("passwordConfirmation", "must match password provided").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }).optional().run(req);
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("error", errors.array());
    return res.redirect(req.headers.referer);
  } else {
    return next();
  }
}

export async function validateComments(req, res, next) {
  if (req.method === "POST") {
    await check("body", "must not be empty").notEmpty().run(req);
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("error", errors.array());
    return res.redirect(req.headers.referer);
  } else {
    return next();
  }
}