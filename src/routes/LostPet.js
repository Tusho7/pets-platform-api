import * as LostPetController from "../controllers/LostPet.js";
import express from "express";
import { middleware } from "../middlewares/auth.js";
import multer from "multer";
import { fileStorageForLostPet, fileFilter } from "../utils/multer.js";

const router = express.Router();

const upload = multer({ storage: fileStorageForLostPet, fileFilter });

router.post(
  "/create-lost-pet",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 5 },
  ]),
  middleware,
  LostPetController.createLostPet
);

router.get("/lost-pets", LostPetController.getLostPets);

export default router;
