import express from "express";
import * as userController from "../controllers/User.js";
import { fileStorage, fileFilter } from "../utils/multer.js";
import multer from "multer";

const router = express.Router();

router.post(
  "/register",
  multer({ storage: fileStorage, fileFilter }).single("profil-picture"),
  userController.createUser
);

export default router;
