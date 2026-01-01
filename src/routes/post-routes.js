import express from "express";
const router = express.Router();
import postController from "../controllers/postController";
import validation from "./validation-routes";
import helper from "../auth/helpers";

router.get("/topics/:topicId/posts/new", postController.new);
router.get("/topics/:topicId/posts/:id", postController.show);
router.get("/topics/:topicId/posts/:id/edit", postController.edit);

router.post("/topics/:topicId/posts/create",
  helper.ensureAuthenticated,
  validation.validatePosts,
  postController.create);
router.post("/topics/:topicId/posts/:id/destroy", postController.destroy);
router.post("/topics/:topicId/posts/:id/update", validation.validatePosts, postController.update);

module.exports = router;