import express from "express";
const router = express.Router();
import validation from "./validation-routes";
import userController from "../controllers/userController";

router.get("/users/sign_up", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id", userController.show);

router.post("/users", validation.validateUsers, userController.create);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);

module.exports = router;