import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// GET /categories - Listar todas as categorias (público)
router.get("/", getCategories);

// GET /categories/:id - Buscar categoria específica (público)
router.get("/:id", getCategoryById);

// POST /categories - Criar categoria (admin)
router.post("/", authMiddleware, adminMiddleware, createCategory);

// PUT /categories/:id - Atualizar categoria (admin)
router.put("/:id", authMiddleware, adminMiddleware, updateCategory);

// DELETE /categories/:id - Deletar categoria (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default router;
