import express from "express";
const router = express.Router();
import * as voteController from "../controllers/voteController.js";

router.get("/topics/:topicId/posts/:postId/votes/upvote", voteController.upvote);
router.get("/topics/:topicId/posts/:postId/votes/downvote", voteController.downvote);
router.get("/topics/:topicId/posts/:postId/votes/mockvote", voteController.mockvote);

export default router;