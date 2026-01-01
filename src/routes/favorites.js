import express from "express";
const router = express.Router();
import favoriteController from "../controllers/favoriteController";

router.post("/topics/:topicId/posts/:postId/favorites/create", favoriteController.create);
router.post("/topics/:topicId/posts/:postId/favorites/:id/destroy", favoriteController.destroy);

module.exports = router;