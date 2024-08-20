import express from "express";
import {getaddBook, addBook } from "../controllers/bookController.js";

const router = express.Router();

router.get("/" , getaddBook);
router.post("/", addBook);

export default router;
