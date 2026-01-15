import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import productRoutes from "./routes/productRoute.js";
import userRoutes from "./routes/userRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
app.locals.supabase = supabase;

// Rotas
app.use("/products", productRoutes);
app.use("/users", userRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend Acessory Store rodando!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
