import { createFavorite, deleteFavorite } from "../db/queries.favorites.js";

export function create(req, res, next) {
  if (req.user) {
    createFavorite(req, (err, favorite) => {
      if (err) {
        req.flash("error", err);
      }
    });
  } else {
    req.flash("notice", "You must be signed in to do that!");
  }
  res.redirect(req.headers.referer);
}
export function destroy(req, res, next) {
  if (req.user) {
    deleteFavorite(req, (err, favorite) => {
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