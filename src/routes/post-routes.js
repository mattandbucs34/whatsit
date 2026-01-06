import express from "express";
const router = express.Router();
import * as postController from "../controllers/postController.js";
import * as validation from "./validation-routes.js";
import * as helper from "../auth/helpers.js";

router.get("/topics/:topicId/posts/new", postController.newPost);
router.get("/topics/:topicId/posts/:id", postController.showPost);
router.get("/topics/:topicId/posts/:id/edit", postController.editPost);

router.post("/topics/:topicId/posts/create",
  helper.ensureAuthenticated,
  validation.validatePosts,
  postController.createPost);
router.post("/topics/:topicId/posts/:id/destroy", postController.destroyPost);
router.post("/topics/:topicId/posts/:id/update", validation.validatePosts, postController.updatePost);

export default router;