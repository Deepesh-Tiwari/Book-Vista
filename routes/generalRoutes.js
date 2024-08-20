import express from "express";
import { getAbout, getFaq } from "../controllers/generalController.js";

const router = express.Router();

router.get("/faq", getFaq);
router.get("/about", getAbout);


export default router;