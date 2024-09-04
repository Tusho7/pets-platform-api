import express from "express";
import * as faqController from "../controllers/Faq.js";

const router = express.Router();

router.post("/create-faq", faqController.createFaq);
router.get("/faqs", faqController.getFaqs);

export default router;
