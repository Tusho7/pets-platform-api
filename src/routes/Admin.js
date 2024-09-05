import express from "express";
import * as adminController from "../controllers/Admin.js";
import { adminMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", adminController.createAdmin);

router.post("/login", adminController.loginAdmin);

router.get("/get_admin", adminMiddleware, adminController.getAdmin);

router.post("/logout", adminController.logoutAdmin);

export default router;
