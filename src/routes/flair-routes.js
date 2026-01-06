import express from "express";
const router = express.Router();
import * as flairController from "../controllers/flairController.js";

router.get("/flairs", flairController.index);
router.get("/flairs/new", flairController.newFlair);
router.get("/flairs/:name", flairController.showFlair);
router.get("/flairs/:name/edit", flairController.editFlair);

router.post("/flairs/create", flairController.createFlair);
router.post("/flairs/:name/destroy", flairController.destroyFlair);
router.post("/flairs/:name/update", flairController.updateFlair);

export default router;