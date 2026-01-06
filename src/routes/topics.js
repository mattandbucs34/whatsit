import express from "express";
const router = express.Router();

import * as topicController from "../controllers/topicController.js";
import * as validation from "./validation-routes.js";

router.get("/topics", topicController.index);
router.get("/topics/new", topicController.newTopic); // Note: renamed to newTopic in controller
router.get("/topics/:id", topicController.show);
router.get("/topics/:id/edit", topicController.edit);

router.post("/topics/create", validation.validateTopics, topicController.create);
router.post("/topics/:id/destroy", topicController.destroy);
router.post("/topics/:id/update", validation.validateTopics, topicController.update);

export default router;