import { createFavorite, deleteFavorite } from "../db/queries.favorites.js";

export async function create(req, res, next) {
  if (req.user) {
    const response = await createFavorite(req);

    if (response.error) {
      req.flash("error", response.message);
    }
  } else {
    req.flash("notice", "You must be signed in to do that!");
  }
  res.redirect(req.headers.referer);
}
export async function destroy(req, res, next) {
  if (req.user) {
    const response = await deleteFavorite(req);

    if (response.error) {
      req.flash("error", response.message);
    }
    res.redirect(req.headers.referer);
  } else {
    req.flash("notice", "You must be signed in to do that!");
    res.redirect(req.headers.referer);
  }
}