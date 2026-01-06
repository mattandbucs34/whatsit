import express from "express";
const router = express.Router();
import * as validation from "./validation-routes.js";
import * as userController from "../controllers/userController.js";

router.get("/users/sign_up", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id", userController.show);

router.post("/users", validation.validateUsers, userController.create);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);

export default router;