import { supabase } from "../config/supabase.js";

/**
 * Middleware para verificar autenticação
 * Verifica se o token Bearer é válido e retorna os dados do usuário
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Obter token do header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token não fornecido ou inválido",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verificar token com Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        message: "Token inválido ou expirado",
      });
    }

    // Obter dados do usuário do banco de dados
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      return res.status(401).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    // Anexar dados do usuário ao request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error("Erro na autenticação:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro ao verificar autenticação",
    });
  }
};
