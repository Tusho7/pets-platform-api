import express from "express";
import * as aboutUsController from "../controllers/About.js";

const router = express.Router();

router.post("/create-aboutus", aboutUsController.createAbout);
router.get("/about_us", aboutUsController.getAboutUs);

export default router;
