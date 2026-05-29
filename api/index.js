const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Use an Express Router so Vercel's rewrite rule works properly
const router = express.Router();

// --- AUTH ENDPOINT ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase
    .from("tb_sekolah")
    .select("*")
    .eq("email", email)
    .eq("password", password);

  if (data && data.length > 0) {
    res.json({ message: "success", code: 200 });
  } else {
    res.json({ message: "failed", code: 403 });
  }
});

// --- BLOG ENDPOINTS ---
router.get("/blogs", async (req, res) => {
  const { data, error } = await supabase
    .from("tb_blog")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/blogs/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("tb_blog")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/blogs", async (req, res) => {
  const { judul, isi, kategori } = req.body;
  const { data, error } = await supabase
    .from("tb_blog")
    .insert([{ judul, isi, kategori }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Blog berhasil ditambahkan", id: data[0].id });
});

router.put("/blogs/:id", async (req, res) => {
  const { judul, isi, kategori } = req.body;
  
  // Use COALESCE logic by selectively updating fields that are provided
  const updateData = {};
  if (judul) updateData.judul = judul;
  if (isi) updateData.isi = isi;
  if (kategori) updateData.kategori = kategori;

  const { data, error } = await supabase
    .from("tb_blog")
    .update(updateData)
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Blog berhasil diubah" });
});

router.delete("/blogs/:id", async (req, res) => {
  const { error } = await supabase
    .from("tb_blog")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Blog berhasil dihapus" });
});

// Mount the router on /api
app.use("/api", router);

// Export for Vercel
module.exports = app;