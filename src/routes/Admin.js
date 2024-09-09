import express from "express";
import * as adminController from "../controllers/Admin.js";
import * as aboutUsController from "../controllers/About.js";
import * as faqController from "../controllers/Faq.js";
import * as termsController from "../controllers/TermsConditions.js";
import { adminMiddleware } from "../middlewares/auth.js";

const router = express.Router();

//admin_routes
router.post("/register", adminController.createAdmin);
router.post("/login", adminController.loginAdmin);
router.get("/get_admin", adminMiddleware, adminController.getAdmin);
router.post("/logout", adminController.logoutAdmin);
router.put("/update_admin/:id", adminMiddleware, adminController.updateAdmin);

//about_us_routes
router.post("/create-aboutus", aboutUsController.createAbout);
router.get("/about_us", adminMiddleware, aboutUsController.getAboutUs);
router.delete(
  "/delete-aboutus/:id",
  adminMiddleware,
  aboutUsController.deleteAboutUs
);
router.post(
  "/update-aboutus/:id",
  adminMiddleware,
  aboutUsController.updateAboutUs
);

//faq_routes
router.post("/create-faq", adminMiddleware, faqController.createFaq);
router.get("/faq", adminMiddleware, faqController.getFaqs);
router.put("/update-faq/:id", adminMiddleware, faqController.editFaqById);
router.delete("/delete-faq/:id", adminMiddleware, faqController.deleteFaqById);

//terms_conditions_routes
router.post("/create-terms", adminMiddleware, termsController.createTerms);
router.get("/terms", adminMiddleware, termsController.getTerms);
router.put("/update-terms/:id", adminMiddleware, termsController.editTermsById);
router.delete(
  "/delete-terms/:id",
  adminMiddleware,
  termsController.deleteTermById
);

//users_routes
router.get("/users", adminMiddleware, adminController.getUsers);
router.patch(
  "/toggle_block_user/:id",
  adminMiddleware,
  adminController.toggleBlockUser
);
router.delete(
  "/delete_user/:id",
  adminMiddleware,
  adminController.deleteUserById
);

export default router;
