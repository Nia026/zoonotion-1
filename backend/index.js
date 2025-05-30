// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const multer = require("multer");
const nodemailer = require("nodemailer");

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Konfigurasi folder penyimpanan file upload
const upload = multer({
  dest: path.join(__dirname, "uploads")
});

// Konfigurasi nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "amrozenk@gmail.com",
    pass: "unul icgb dzxs ngvl", // Ganti dengan app password Gmail, JANGAN password biasa!
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Fungsi untuk mengirim email OTP
async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: '"Zoonotion" <amrozenk@gmail.com>',
    to,
    subject: "Kode OTP Verifikasi Akun Zoonotion",
    text: `Kode OTP Anda: ${otp}`,
    html: `<p>Kode OTP Anda: <b>${otp}</b></p>`,
  });
}

// === USERS ===

// Register user
app.post('/api/users/register', async (req, res) => {
  const { email, username, password } = req.body;
  const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    // Cek email sudah ada atau belum
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        email,
        username,
        password: hashed,
        otp_code,
        is_verified: false,
      },
    });
    await sendOtpEmail(email, otp_code);
    res.json({ message: "Registrasi berhasil. Silakan cek email untuk OTP." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login user
app.post('/api/users/login', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // Cari user berdasarkan email ATAU username
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { username: username || undefined }
        ]
      }
    });
    if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

    // Bandingkan password dengan hash di database
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Password salah" });

    // Cek verifikasi OTP
    if (!user.is_verified) return res.status(400).json({ message: "Akun belum diverifikasi OTP" });

    // Jangan kirim password ke frontend
    const { password: _, ...userData } = user;
    res.json({ user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk ambil semua user
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verifikasi OTP
app.post("/api/users/verify-otp", async (req, res) => {
  const { email, otp_code } = req.body;
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
  if (user.otp_code !== otp_code) return res.status(400).json({ message: "OTP salah" });

  await prisma.users.update({
    where: { email },
    data: { is_verified: true, otp_code: null },
  });
  res.json({ message: "Verifikasi berhasil, silakan login." });
});

// === ARTICLES ===
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await prisma.articles.findMany();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
    const { judul_artikel, isi_artikel, nama_author, gambar_artikel } = req.body;
    const artikel = await prisma.articles.create({
      data: { judul_artikel, isi_artikel, nama_author, gambar_artikel }
    });
    res.json(artikel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === ADMINS ===
app.get('/api/admins', async (req, res) => {
  try {
    const admins = await prisma.admins.findMany();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === COMMUNITIES ===
app.get('/api/communities', async (req, res) => {
  try {
    const communities = await prisma.communities.findMany({
      include: { galleries: true }
    });
    res.json(communities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/communities', upload.single("banner_komunitas"), async (req, res) => {
  try {
    const { nama_komunitas, deskripsi_komunitas, nama_penyelenggara, tahun_penyelenggara } = req.body;
    let banner_komunitas = null;
    if (req.file) {
      banner_komunitas = `/uploads/${req.file.filename}`;
    }
    const komunitas = await prisma.communities.create({
      data: {
        nama_komunitas,
        deskripsi_komunitas,
        nama_penyelenggara,
        tahun_penyelenggara: tahun_penyelenggara ? Number(tahun_penyelenggara) : null,
        banner_komunitas
      }
    });
    res.json(komunitas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === EDUCATIONS ===
app.get('/api/educations', async (req, res) => {
  try {
    const educations = await prisma.educations.findMany();
    res.json(educations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/educations', upload.single("gambar_hewan"), async (req, res) => {
  try {
    const { nama_hewan, kategori_hewan, deskripsi_hewan } = req.body;
    let gambar_hewan = null;
    if (req.file) {
      gambar_hewan = `/uploads/${req.file.filename}`;
    }
    const hewan = await prisma.educations.create({
      data: { nama_hewan, kategori_hewan, deskripsi_hewan, gambar_hewan }
    });
    res.json(hewan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === GALLERIES ===
app.get('/api/galleries', async (req, res) => {
  try {
    const galleries = await prisma.galleries.findMany({
      include: { communities: true }
    });
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === ZOOS ===
app.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await prisma.zoos.findMany();
    res.json(zoos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// --- CRUD user_profiles ---

// GET semua user_profiles
app.get("/api/user_profiles", async (req, res) => {
  try {
    const profiles = await prisma.user_profiles.findMany();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST tambah user_profile
app.post("/api/user_profiles", async (req, res) => {
  try {
    const { user_id, username, email, tanggal_lahir, alamat, noted } = req.body;
    const profile = await prisma.user_profiles.create({
      data: {
        user_id: Number(user_id),
        username,
        email,
        tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
        alamat,
        noted,
      },
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update user_profile
app.put("/api/user_profiles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, username, email, tanggal_lahir, alamat, noted } = req.body;
    const profile = await prisma.user_profiles.update({
      where: { id: Number(id) },
      data: {
        user_id: Number(user_id),
        username,
        email,
        tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
        alamat,
        noted,
      },
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user_profile
app.delete("/api/user_profiles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user_profiles.delete({ where: { id: Number(id) } });
    res.json({ message: "User profile deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPLOAD foto_profil
app.post("/api/user_profiles/:id/upload", upload.single("foto_profil"), async (req, res) => {
  try {
    const { id } = req.params;
    let foto_profil = null;
    if (req.file) {
      foto_profil = `/uploads/${req.file.filename}`;
    }
    const updated = await prisma.user_profiles.update({
      where: { id: Number(id) },
      data: { foto_profil },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
