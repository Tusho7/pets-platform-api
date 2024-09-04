import express from "express";
import * as userController from "../controllers/User.js";
import { fileStorage, fileFilter } from "../utils/multer.js";
import multer from "multer";
import { middleware } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/register",
  multer({ storage: fileStorage, fileFilter }).single("profile-pictures"),
  userController.createUser
);

router.post("/login", userController.loginUser);

router.get("/get_user", middleware, userController.getUser);

export default router;
