import express from "express";
const router = express.Router();
import * as advertController from "../controllers/advertController.js";

router.get("/adverts", advertController.index);
router.get("/adverts/new", advertController.newAdvert);
router.get("/adverts/:id", advertController.showAdvert);
router.get("/adverts/:id/edit", advertController.editAdvert);

router.post("/adverts/create", advertController.createAdvert);
router.post("/adverts/:id/destroy", advertController.destroyAdvert);
router.post("/adverts/:id/update", advertController.updateAdvert);

export default router;