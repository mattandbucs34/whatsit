import { createVote } from "../db/queries.votes.js";

export function upvote(req, res, next) {
  if (req.user) {
    createVote(req, 1, (err, vote) => {
      if (err) {
        req.flash("error", err);
      }
      res.redirect(req.headers.referer);
    });
  } else {
    req.flash("notice", "You must be signed in to do that!");
    res.redirect(req.headers.referer);
  }
}
export function downvote(req, res, next) {
  if (req.user) {
    createVote(req, -1, (err, vote) => {
      if (err) {
        req.flash("error", err);
      }
      res.redirect(req.headers.referer);
    });
  } else {
    req.flash("notice", "You must be signed in to do that!");
    res.redirect(req.headers.referer);
  }
}
export function mockvote(req, res, next) {
  if (req.user) {
    createVote(req, 2, (err, vote) => {
      if (err) {
        req.flash("error", err);
      }
      res.redirect(req.headers.referer);
    });
  } else {
    req.flash("notice", "You must be signed in to do that!");
    res.redirect(req.headers.referer);
  }
}