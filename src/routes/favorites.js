import express from "express";
const router = express.Router();
import * as favoriteController from "../controllers/favoriteController.js";

router.post("/topics/:topicId/posts/:postId/favorites/create", favoriteController.create);
router.post("/topics/:topicId/posts/:postId/favorites/:id/destroy", favoriteController.destroy);

export default router;