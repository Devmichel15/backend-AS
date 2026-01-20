import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// GET /products - Listar todos os produtos (público)
router.get("/", getProducts);

// GET /products/:id - Buscar produto específico (público)
router.get("/:id", getProductById);

// POST /products - Criar produto (admin)
router.post("/", authMiddleware, adminMiddleware, createProduct);

// PUT /products/:id - Atualizar produto (admin)
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// DELETE /products/:id - Deletar produto (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
