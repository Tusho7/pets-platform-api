import express from "express";
import * as adminController from "../controllers/Admin.js";
import * as aboutUsController from "../controllers/About.js";
import { adminMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", adminController.createAdmin);

router.post("/login", adminController.loginAdmin);

router.get("/get_admin", adminMiddleware, adminController.getAdmin);

router.post("/logout", adminController.logoutAdmin);

//about_us_routes
router.post("/create-aboutus", aboutUsController.createAbout);
router.get("/about_us", adminMiddleware, aboutUsController.getAboutUs);
router.delete(
  "/delete-aboutus/:id",
  adminMiddleware,
  aboutUsController.deleteAboutUs
);

export default router;
