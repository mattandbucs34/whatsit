import express from "express";
const router = express.Router();
import flairController from "../controllers/flairController";

router.get("/flairs", flairController.index);
router.get("/flairs/new", flairController.new);
router.get("/flairs/:name", flairController.show);
router.get("/flairs/:name/edit", flairController.edit);

router.post("/flairs/create", flairController.create);
router.post("/flairs/:name/destroy", flairController.destroy);
router.post("/flairs/:name/update", flairController.update);

module.exports = router;