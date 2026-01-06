import express from "express";
const router = express.Router();
import * as staticController from "../controllers/staticController.js";

router.get("/", staticController.index);
router.get("/about", staticController.about);

export default router;