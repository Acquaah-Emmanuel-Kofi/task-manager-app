import { Router } from "express";
import { handleLogin, handleRegister } from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/register", handleRegister);
authRoutes.post("/login", handleLogin);

export default authRoutes;
