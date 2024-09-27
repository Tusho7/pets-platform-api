import * as StreetPetController from "../controllers/StreetPet.js";
import express from "express";
import { middleware } from "../middlewares/auth.js";
import multer from "multer";
import { fileStorageForStreetPet, fileFilter } from "../utils/multer.js";

const router = express.Router();

const upload = multer({ storage: fileStorageForStreetPet, fileFilter });

router.post(
  "/create-street-pet",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 5 },
  ]),
  middleware,
  StreetPetController.createStreetPet
);

router.get("/street-pets", StreetPetController.getStreetPets);

export default router;
