import Comment from "./models";
import Authorizer from "../policies/comment-policy";

export async function createComment(newComment) {
    try {
        const response = await Comment.create(newComment);
        return response;
    } catch (err) {
        console.error('There was an issue creating this comment: ', err);
        return { error: err, message: 'There was an issue creating this comment' };
    }
}

export async function deleteComment(req) {
    try {
        const comment = await Comment.findById(req.params.id);
        const authorized = new Authorizer(req.user, comment).destroy();

        if (authorized) {
            await comment.destroy();
            return true;
        } else {
            return { error: 'Unauthorized', message: 'You are not authorized to delete this comment' };
        }
    } catch (err) {
        console.error('There was an issue deleting this comment: ', err);
        return { error: err, message: 'There was an issue deleting this comment' };
    }
}