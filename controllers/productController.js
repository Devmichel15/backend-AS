export const getProducts = async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const getProductById = async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { id } = req.params;
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const createProduct = async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { name, price, description, images } = req.body;

  if (!name || !price || !images) {
    return res.status(400).json({ error: "name, price e images são obrigatórios" });
  }

  const { data, error } = await supabase.from("products").insert([{ name, price, description, images }]);
  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
};

export const updateProduct = async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { id } = req.params;
  const { name, price, description, images } = req.body;

  const { data, error } = await supabase.from("products").update({ name, price, description, images }).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const deleteProduct = async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { id } = req.params;

  const { data, error } = await supabase.from("products").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Produto deletado", data });
};
