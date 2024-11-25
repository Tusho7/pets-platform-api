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

router.get(
  "/lost-pet/:userId",
  middleware,
  LostPetController.getLostPetsByUserId
);

router.put(
  "/lost-pet/:userId",
  middleware,
  LostPetController.updateLostPetByUserId
);

router.delete(
  "/lost-pet/:userId/:petId",
  middleware,
  LostPetController.deleteLostPetByUserId
);

router.delete(
  "/lost-pet/:petId/:filename/:userId",
  middleware,
  LostPetController.deleteLostPetImageByFilename
);

router.put(
  "/lost-pet/:petId/:userId",
  upload.fields([{ name: "images", maxCount: 5 }]),
  middleware,
  LostPetController.uploadLostPetImages
);

router.put(
  "/lost-pet-video/:petId/:userId",
  upload.fields([{ name: "videos", maxCount: 5 }]),
  middleware,
  LostPetController.uploadLostPetVideos
);

router.delete(
  "/lost-pet-video/:petId/:filename/:userId",
  middleware,
  LostPetController.deleteLostPetVideoByFilename
);

export default router;
