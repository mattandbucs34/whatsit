import { createComment, deleteComment } from "../db/queries.comments.js";
import Authorizer from "../policies/comment-policy.js";

export function create(req, res, next) {
  const authorized = new Authorizer(req.user).create();

  if (authorized) {
    let newComment = {
      body: req.body.body,
      userId: req.user.id,
      postId: req.params.postId
    };

    createComment(newComment, (err, comment) => {
      if (err) {
        req.flash("error", err);
      }
      res.redirect(req.headers.referer);
    });
  } else {
    req.flash("notice", "You must be signed in to do that!");
    req.redirect("/users/sign_in");
  }
}
export function destroy(req, res, next) {
  deleteComment(req, (err, comment) => {
    if (err) {
      res.redirect(err, req.headers.referer);
    } else {
      res.redirect(req.headers.referer);
    }
  });
}