import express from "express";
const router = express.Router();

import topicController from "../controllers/topicController";
import validation from "./validation-routes";

router.get("/topics", topicController.index);
router.get("/topics/new", topicController.new);
router.get("/topics/:id", topicController.show);
router.get("/topics/:id/edit", topicController.edit);

router.post("/topics/create", validation.validateTopics, topicController.create);
router.post("/topics/:id/destroy", topicController.destroy);
router.post("/topics/:id/update", validation.validateTopics, topicController.update);

module.exports = router;