/**
 * Middleware para verificar se o usuário é administrador
 * Deve ser usado APÓS authMiddleware
 */
export const adminMiddleware = (req, res, next) => {
  try {
    // Verificar se o usuário está autenticado (authMiddleware foi executado)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Não autenticado",
      });
    }

    // Verificar se o usuário é admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acesso negado. Apenas administradores podem acessar este recurso",
      });
    }

    next();
  } catch (error) {
    console.error("Erro na verificação de admin:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro ao verificar permissão",
    });
  }
};
