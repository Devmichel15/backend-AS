import { supabase } from "../config/supabase.js";

/**
 * GET /categories
 * Listar todas as categorias (público)
 */
export const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Erro ao buscar categorias",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Erro ao listar categorias:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

/**
 * GET /categories/:id
 * Buscar uma categoria específica
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Erro ao buscar categoria:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

/**
 * POST /categories
 * Criar nova categoria (admin)
 */
export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    // Validações
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Nome e slug são obrigatórios",
      });
    }

    // Verificar se slug já existe
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug já existe",
      });
    }

    // Criar categoria
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Erro ao criar categoria",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Categoria criada com sucesso",
      data: data[0],
    });
  } catch (error) {
    console.error("Erro ao criar categoria:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

/**
 * PUT /categories/:id
 * Atualizar categoria (admin)
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    // Validações
    if (!name && !slug) {
      return res.status(400).json({
        success: false,
        message: "Forneça pelo menos um campo para atualizar",
      });
    }

    // Verificar se categoria existe
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("id", id)
      .single();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
    }

    // Verificar se novo slug já existe (se fornecido)
    if (slug) {
      const { data: slugExists } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .neq("id", id)
        .single();

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Slug já existe",
        });
      }
    }

    // Atualizar
    const { data, error } = await supabase
      .from("categories")
      .update({
        ...(name && { name }),
        ...(slug && { slug }),
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Erro ao atualizar categoria",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categoria atualizada com sucesso",
      data: data[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

/**
 * DELETE /categories/:id
 * Deletar categoria (admin)
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se categoria existe
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("id", id)
      .single();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
    }

    // Verificar se há produtos nessa categoria
    const { data: products } = await supabase
      .from("products")
      .select("id")
      .eq("category_id", id);

    if (products && products.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Não é possível deletar uma categoria que possui produtos",
      });
    }

    // Deletar
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Erro ao deletar categoria",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categoria deletada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};
