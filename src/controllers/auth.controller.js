import { supabase } from "../config/supabase.js";

/**
 * POST /auth/register
 * Cadastro de novo usuário
 */
export const register = async (req, res) => {
  try {
    const { email, password, role = "user" } = req.body;

    // Validações básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
      });
    }

    // Validar se role é válido
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role deve ser 'user' ou 'admin'",
      });
    }

    // Criar usuário no Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message || "Erro ao criar usuário",
      });
    }

    // Criar registro na tabela users
    const { data: user, error: dbError } = await supabase
      .from("users")
      .insert({
        id: authUser.user.id,
        email,
        role,
        created_at: new Date().toISOString(),
      })
      .select();

    if (dbError) {
      // Se falhar ao criar no banco, remover da auth
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return res.status(400).json({
        success: false,
        message: "Erro ao criar registro do usuário no banco",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Usuário registrado com sucesso",
      data: {
        id: user[0].id,
        email: user[0].email,
        role: user[0].role,
        created_at: user[0].created_at,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

/**
 * POST /auth/login
 * Autenticação de usuário
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
      });
    }

    // Autenticar no Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message || "Email ou senha incorretos",
      });
    }

    // Obter dados do usuário
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      data: {
        token: data.session.access_token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};
