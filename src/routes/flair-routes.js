const express = require("express");
const router = express.Router();
const flairController = require("../controllers/flairController");

router.get("/flairs", flairController.index);
router.get("/flairs/new", flairController.new);
router.get("/flairs/:name", flairController.show);
router.get("/flairs/:name/edit", flairController.edit);

router.post("/flairs/create", flairController.create);
router.post("/flairs/:name/destroy", flairController.destroy);
router.post("/flairs/:name/update", flairController.update);

module.exports = router;