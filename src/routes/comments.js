import express from "express";
const router = express.Router();
import commentController from "../controllers/commentController";
import validation from "./validation-routes";

router.post("/topics/:topicId/posts/:postId/comments/create", validation.validateComments, commentController.create);
router.post("/topics/:topicId/posts/:postId/comments/:id/destroy", commentController.destroy);

module.exports = router;