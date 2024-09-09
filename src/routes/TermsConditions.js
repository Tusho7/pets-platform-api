import express from "express";
import * as termsController from "../controllers/TermsConditions.js";

const router = express.Router();

router.get("/terms", termsController.getTerms);

export default router;
