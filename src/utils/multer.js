import multer from "multer";

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
    file.fieldname === "images" &&
    (file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg")
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
