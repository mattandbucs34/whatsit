import { createComment, deleteComment } from "../db/queries.comments.js";
import Authorizer from "../policies/comment-policy.js";

export async function create(req, res, next) {
    const authorized = new Authorizer(req.user).create();

    if (authorized) {
        let newComment = {
            body: req.body.body,
            userId: req.user.id,
            postId: req.params.postId
        };

        const response = await createComment(newComment);

        if (response.error) {
            req.flash("error", response.message);
        }

        res.redirect(req.headers.referer);

    } else {
        req.flash("notice", "You must be signed in to do that!");
        req.redirect("/users/sign_in");
    }
}
export async function destroy(req, res, next) {
    const response = await deleteComment(req);

    if (response.error) {
        res.redirect(response.error, req.headers.referer);
    } else {
        res.redirect(req.headers.referer);
    }
}