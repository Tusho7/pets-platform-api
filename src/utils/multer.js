import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profile-pictures");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const fileFilter = (req, file, cb) => {
  if (
    (file.fieldname === "images" &&
      (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg")) ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/svg+xml" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else if (
    file.fieldname === "videos" &&
    (file.mimetype === "video/mp4" || file.mimetype === "video/mkv")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const fileFilterForUser = (req, file, cb) => {
  if (
    file.fieldname === "profile-pictures" &&
    (file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const fileStorageForLostPet = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "images") {
      cb(null, "public/lost-pet-images");
    } else if (file.fieldname === "videos") {
      cb(null, "public/lost-pet-videos");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const fileStorageForStreetPet = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "images") {
      cb(null, "public/street-pet-images");
    } else if (file.fieldname === "videos") {
      cb(null, "public/street-pet-videos");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = process.env.PUBLIC_DIR;
const lostPetImagesDir = process.env.LOST_PET_IMAGES_DIR;
const streetPetImagesDir = process.env.STREET_PET_IMAGES_DIR;

export const deleteImageFile = (filename) => {
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    publicDir,
    lostPetImagesDir,
    filename
  );

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      throw err;
    }
  });
};

export const deleteImageFileForStreetPets = (filename) => {
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    publicDir,
    streetPetImagesDir,
    filename
  );

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      throw err;
    }
  });
};
