export const getUsers = async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const createUser = async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "name e email são obrigatórios" });
  }

  const { data, error } = await supabase.from("users").insert([{ name, email, role: role || "user" }]);
  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
};
