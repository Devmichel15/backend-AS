import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

// POST /auth/register - Cadastro de novo usuário
router.post("/register", register);

// POST /auth/login - Autenticação
router.post("/login", login);

export default router;
