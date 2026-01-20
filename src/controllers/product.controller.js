import { supabase } from "../config/supabase.js";

/**
 * GET /products
 * Listar todos os produtos com suas imagens e categoria
 */
export const getProducts = async (req, res) => {
  try {
    // Buscar todos os produtos com a categoria
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        price,
        created_at,
        categories:category_id(id, name)
      `)
      .order("created_at", { ascending: false });

    if (productsError) {
      return res.status(400).json({
        success: false,
        message: "Erro ao buscar produtos",
      });
    }

    // Para cada produto, buscar as imagens
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const { data: images } = await supabase
          .from("product_images")
          .select("image_url")
          .eq("product_id", product.id)
          .order("created_at", { ascending: true });

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: Array.isArray(product.categories) 
            ? product.categories[0] 
            : product.categories,
          images: (images || []).map((img) => img.image_url),
          created_at: product.created_at,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: productsWithImages,
    });
  } catch (error) {
    console.error("Erro ao listar produtos:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

/**
 * GET /products/:id
 * Buscar um produto específico
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar produto com categoria
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        price,
        created_at,
        categories:category_id(id, name)
      `)
      .eq("id", id)
      .single();

    if (productError || !product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    // Buscar imagens
    const { data: images } = await supabase
      .from("product_images")
      .select("image_url")
      .eq("product_id", id)
      .order("created_at", { ascending: true });

    const response = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: Array.isArray(product.categories) 
        ? product.categories[0] 
        : product.categories,
      images: (images || []).map((img) => img.image_url),
      created_at: product.created_at,
    };

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Erro ao buscar produto:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

/**
 * POST /products
 * Criar novo produto (admin)
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, images = [] } = req.body;

    // Validações
    if (!name || !description || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: "Nome, descrição, preço e category_id são obrigatórios",
      });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Preço deve ser um número positivo",
      });
    }

    // Validar se categoria existe
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("id", category_id)
      .single();

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Categoria não encontrada",
      });
    }

    // Criar produto
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price,
        category_id,
        created_at: new Date().toISOString(),
      })
      .select();

    if (productError) {
      return res.status(400).json({
        success: false,
        message: "Erro ao criar produto",
      });
    }

    // Criar imagens
    let productImages = [];
    if (images.length > 0) {
      const imagesToInsert = images.map((image_url) => ({
        product_id: product[0].id,
        image_url,
        created_at: new Date().toISOString(),
      }));

      const { data: createdImages, error: imagesError } = await supabase
        .from("product_images")
        .insert(imagesToInsert)
        .select();

      if (imagesError) {
        console.error("Erro ao criar imagens:", imagesError);
      } else {
        productImages = (createdImages || []).map((img) => img.image_url);
      }
    }

    // Buscar categoria completa
    const { data: categoryData } = await supabase
      .from("categories")
      .select("*")
      .eq("id", category_id)
      .single();

    const response = {
      id: product[0].id,
      name: product[0].name,
      description: product[0].description,
      price: product[0].price,
      category: categoryData,
      images: productImages,
      created_at: product[0].created_at,
    };

    return res.status(201).json({
      success: true,
      message: "Produto criado com sucesso",
      data: response,
    });
  } catch (error) {
    console.error("Erro ao criar produto:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

/**
 * PUT /products/:id
 * Atualizar produto (admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category_id,
      images = [],
      images_to_remove = [],
    } = req.body;

    // Validar se produto existe
    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    // Validar categoria se fornecida
    if (category_id) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("id", category_id)
        .single();

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Categoria não encontrada",
        });
      }
    }

    // Atualizar dados básicos
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) {
      if (typeof price !== "number" || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Preço deve ser um número positivo",
        });
      }
      updateData.price = price;
    }
    if (category_id) updateData.category_id = category_id;

    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select();

    if (updateError) {
      return res.status(400).json({
        success: false,
        message: "Erro ao atualizar produto",
      });
    }

    // Remover imagens
    if (images_to_remove.length > 0) {
      await supabase
        .from("product_images")
        .delete()
        .in("image_url", images_to_remove)
        .eq("product_id", id);
    }

    // Adicionar novas imagens
    if (images.length > 0) {
      const imagesToInsert = images.map((image_url) => ({
        product_id: id,
        image_url,
        created_at: new Date().toISOString(),
      }));

      await supabase.from("product_images").insert(imagesToInsert);
    }

    // Buscar produto atualizado com todas as informações
    const { data: finalProduct } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        price,
        created_at,
        categories:category_id(id, name)
      `)
      .eq("id", id)
      .single();

    const { data: finalImages } = await supabase
      .from("product_images")
      .select("image_url")
      .eq("product_id", id)
      .order("created_at", { ascending: true });

    const response = {
      id: finalProduct.id,
      name: finalProduct.name,
      description: finalProduct.description,
      price: finalProduct.price,
      category: Array.isArray(finalProduct.categories) 
        ? finalProduct.categories[0] 
        : finalProduct.categories,
      images: (finalImages || []).map((img) => img.image_url),
      created_at: finalProduct.created_at,
    };

    return res.status(200).json({
      success: true,
      message: "Produto atualizado com sucesso",
      data: response,
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

/**
 * DELETE /products/:id
 * Deletar produto (admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se produto existe
    const { data: product } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    // Deletar imagens do produto
    await supabase.from("product_images").delete().eq("product_id", id);

    // Deletar produto
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Erro ao deletar produto",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Produto deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar produto:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};
