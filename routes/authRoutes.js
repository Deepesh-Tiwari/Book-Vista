import express from "express";
import {getregister, register, getlogin, login, googleAuth, logout } from "../controllers/authController.js";
import passport from "passport";

const router = express.Router();

router.post("/register", register);
router.get("/register",getregister);
router.get("/login",getlogin);
router.post("/login", login);
router.get("/logout", logout);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/secrets", googleAuth);

export default router;
