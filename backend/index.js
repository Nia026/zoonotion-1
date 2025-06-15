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
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}); 

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
        role: "user",
      },
    });
    console.log("User created:", user);
    const newUser = await prisma.users.findUnique({ where: { id: user.id } });
    console.log("New user fetched:", newUser);
    await sendOtpEmail(email, otp_code);
    res.json({ message: "Registrasi berhasil. Silakan cek email untuk OTP." });
  } catch (err) {
    console.error("Error during registration:", err);
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
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    console.log("User before verification:", user); // Tambahkan logging
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    if (user.otp_code !== otp_code) return res.status(400).json({ message: "OTP salah" });

    await prisma.users.update({
      where: { email },
      data: { is_verified: true, otp_code: null },
    });

    const updatedUser = await prisma.users.findUnique({ where: { email } });
    console.log("User after verification:", updatedUser); // Tambahkan logging

    const { password: _, ...userData } = updatedUser;
    console.log("User data sent:", userData); // Tambahkan logging
    res.json({ message: "Verifikasi berhasil, silakan login.", user: userData });
  } catch (err) {
    console.error("Error during OTP verification:", err); // Tambahkan logging error
    res.status(500).json({ message: err.message });
  }
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

app.get('/api/articles/:id', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id); // Prisma membutuhkan ID sebagai integer

    // Mencari artikel berdasarkan ID
    const article = await prisma.articles.findUnique({
      where: {
        id: articleId,
      },
      // Anda bisa memilih kolom yang ingin diambil jika tidak semua dibutuhkan
      select: {
        id: true,
        judul_artikel: true,
        gambar_artikel: true,
        isi_artikel: true,
        nama_author: true,
        publish_date: true,
        created_at: true,
      },
    });

    if (!article) {
      // Jika artikel tidak ditemukan
      return res.status(404).json({ message: 'Article not found' });
    }

    // Mengirimkan data artikel yang ditemukan
    res.json(article);
  } catch (err) {
    console.error('Error fetching article by ID:', err);
    res.status(500).json({ message: 'Error fetching article', error: err.message });
  }
});

app.post('/api/articles', upload.single('gambar_artikel'),async (req, res) => {
  try {
    const { judul_artikel, isi_artikel, nama_author } = req.body;
    let gambar_artikel_path = null;
    if (req.file) {
      gambar_artikel_path = `/uploads/${req.file.filename}`; // Menyimpan path relatif
    }
    const artikel = await prisma.articles.create({
      data: { judul_artikel, 
              isi_artikel, 
              nama_author, 
              gambar_artikel: gambar_artikel_path,
            }
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

app.post('/api/communities/:id/galleries', upload.array("gambar_galeri", 10), async (req, res) => {
  try {
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const { id } = req.params;
    const { deskripsi_gambar } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Tidak ada file yang diunggah." });
    }

    const galleriesData = files.map(file => ({
      community_id: Number(id),
      gambar_galeri: `/uploads/${file.filename}`,
      deskripsi_gambar: deskripsi_gambar || null,
    }));

    const galleries = await prisma.galleries.createMany({
      data: galleriesData,
    });

    res.json({ message: "Galeri berhasil ditambahkan.", galleries });
  } catch (err) {
    console.error("Error in POST /api/communities/:id/galleries:", err);
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

app.post('/api/galleries', upload.array('images'), async (req, res) => {
  try {
    const { community_id, title } = req.body;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    const galleryEntries = await Promise.all(
      imagePaths.map(image =>
        prisma.galleries.create({ data: { community_id: Number(community_id), title, image } })
      )
    );
    res.json(galleryEntries);
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

app.post('/api/zoos', upload.single('gambar_zoo'), async (req, res) => {
  const { nama_kebun_binatang, deskripsi_kebun_binatang, link_web_resmi, link_tiket } = req.body;
  let gambar_zoo_path = null;

  if (req.file) {
      // Path relatif dari root server backend Anda
      gambar_zoo_path = `/uploads/${req.file.filename}`;
  }
  // Validasi input
  if (!nama_kebun_binatang) {
      return res.status(400).json({ message: 'Nama kebun binatang wajib diisi.' });
  }
  try {
      const newZoo = await prisma.zoos.create({
          data: {
              nama_kebun_binatang,
              deskripsi_kebun_binatang,
              link_web_resmi,
              link_tiket,
              gambar_zoo: gambar_zoo_path, // Simpan path file di database
          },
      });
      res.status(201).json({ message: 'Kebun binatang berhasil ditambahkan!', zoo: newZoo });
  } catch (error) {
      console.error('Error adding new zoo:', error);
      // Tangani error jika nama kebun binatang sudah ada (unique constraint)
      if (error.code === 'P2002' && error.meta?.target?.includes('nama_kebun_binatang')) {
          return res.status(409).json({ message: 'Nama kebun binatang sudah ada.' });
      }
      res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan kebun binatang.', error: error.message });
  }
});

// GET semua user_profiles
app.get("/api/user_profiles", async (req, res) => {
  try {
    const profiles = await prisma.user_profiles.findMany();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/profile/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    // Ambil data dasar user dari tabel users (email dan username)
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true }
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Coba ambil user_profile
    const userProfile = await prisma.user_profiles.findFirst({
      where: { user_id: userId },
    });

    // Jika user_profile belum ada, kembalikan data dari tabel users dengan field lain kosong
    if (!userProfile) {
      return res.json({
        user_id: user.id,
        username: user.username, 
        email: user.email,     
        foto_profil: null,
        tanggal_lahir: null,
        alamat: null,
        noted: null
      });
    }

    // Jika user_profile ada, gabungkan dengan data username/email dari tabel users
    const formattedProfile = {
      user_id: user.id,
      username: user.username,
      email: user.email,
      foto_profil: userProfile.foto_profil || null,
      tanggal_lahir: userProfile.tanggal_lahir ? userProfile.tanggal_lahir.toISOString().split('T')[0] : null,
      alamat: userProfile.alamat || null,
      noted: userProfile.noted || null,
    };

    res.json(formattedProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT update user_profile
app.put('/api/profile/:userId', upload.single('foto_profil'), async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided." });
  }

  try {
    const { tanggal_lahir, alamat, noted } = req.body;
    let foto_profil_path = null;

    if (req.file) {
      foto_profil_path = `/uploads/${req.file.filename}`;
    }

    // Ambil data dasar user dari tabel users untuk username dan email
    const userBaseData = await prisma.users.findUnique({
        where: { id: userId },
        select: { username: true, email: true }
    });

    if (!userBaseData) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const existingUserProfile = await prisma.user_profiles.findFirst({
        where: { user_id: userId }
    });

    let updatedProfile;
    if (existingUserProfile) {
        // Jika profil sudah ada, lakukan update
        updatedProfile = await prisma.user_profiles.update({
            where: { id: existingUserProfile.id }, // Update berdasarkan ID internal user_profiles
            data: {
                tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null, // Gunakan null untuk menghapus
                alamat: alamat,
                noted: noted,
                foto_profil: foto_profil_path !== null ? foto_profil_path : undefined, // Biarkan undefined jika tidak ada upload baru
            },
        });
    } else {
        updatedProfile = await prisma.user_profiles.create({
            data: {
                user_id: userId,
                username: userBaseData.username, 
                email: userBaseData.email,     
                tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
                alamat: alamat,
                noted: noted,
                foto_profil: foto_profil_path,
            },
        });
    }

    const formattedResponse = {
      user_id: updatedProfile.user_id,
      username: userBaseData.username, 
      email: userBaseData.email,     
      foto_profil: updatedProfile.foto_profil,
      tanggal_lahir: updatedProfile.tanggal_lahir ? updatedProfile.tanggal_lahir.toISOString().split('T')[0] : null,
      alamat: updatedProfile.alamat,
      noted: updatedProfile.noted,
    };

    res.json({ message: 'Profile updated successfully', profile: formattedResponse });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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

// 404 handler
app.use((req, res) => {
  console.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});