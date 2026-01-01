import express from "express";
const router = express.Router();
import staticController from "../controllers/staticController";

/* router.get("/", (req, res, next) => {
  res.send("Welcome to Bloccit");
}); */

router.get("/", staticController.index);

router.get("/about", staticController.about);

/* router.get("/marco", (req, res, next) => {
  res.send("polo");
}); */

module.exports = router;