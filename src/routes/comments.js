import express from "express";
const router = express.Router();
import * as commentController from "../controllers/commentController.js";
import * as validation from "./validation-routes.js";

router.post("/topics/:topicId/posts/:postId/comments/create", validation.validateComments, commentController.create);
router.post("/topics/:topicId/posts/:postId/comments/:id/destroy", commentController.destroy);

export default router;