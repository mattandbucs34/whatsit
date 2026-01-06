import { createVote } from "../db/queries.votes.js";

export async function upvote(req, res, next) {
  if (req.user) {
    try {
      await createVote(req, 1);
      res.redirect(req.headers.referer);
    } catch (err) {
      req.flash("error", err);
      res.redirect(req.headers.referer);
    }
  } else {
    req.flash("notice", "You must be signed in to do that!");
    res.redirect(req.headers.referer);
  }
}
export async function downvote(req, res, next) {
  if (req.user) {
    try {
      await createVote(req, -1);
      res.redirect(req.headers.referer);
    } catch (err) {
      req.flash("error", err);
      res.redirect(req.headers.referer);
    }
  } else {
    req.flash("notice", "You must be signed in to do that!");
    res.redirect(req.headers.referer);
  }
}
export async function mockvote(req, res, next) {
  if (req.user) {
    try {
      await createVote(req, 2);
      res.redirect(req.headers.referer);
    } catch (err) {
      req.flash("error", err);
      res.redirect(req.headers.referer);
    }
  } else {
    req.flash("notice", "You must be signed in to do that!");
    res.redirect(req.headers.referer);
  }
}