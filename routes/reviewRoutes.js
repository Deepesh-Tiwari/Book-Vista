import express from "express";
import { getAllReviews, getMyReviews, addReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getAllReviews);
router.get("/my", getMyReviews);
router.post("/:isbn", addReview);

export default router;
