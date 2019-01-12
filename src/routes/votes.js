const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");

router.get("/topics/:topicId/posts/:postId/votes/upvote", voteController.upvote);
router.get("/topics/:topicId/posts/:postId/votes/downvote", voteController.downvote);
router.get("/topics/:topicId/posts/:postId/votes/mockvote", voteController.mockvote);

module.exports = router;