import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Acessory Store rodando!",
    version: "1.0.0",
  });
});

// Rotas
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
  });
});

// Tratamento de erro global
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
  });
});

export default app;
