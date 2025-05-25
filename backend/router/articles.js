const express = require('express');
const router = express.Router(); 
const db = require('../config/db');
const uploadFile = require('../config/multerConfig');
const fs = require('fs');
const path = require('path');

const uploadArticleImage = uploadFile('articles').single('gambar_artikel');

router.get('/', (req, res) => {
  db.query('SELECT * FROM articles ORDER BY publish_date DESC', (err, results) => {
    if (err) {
      console.error('Error fetching articles:', err);
      return res.status(500).json({ error: 'Failed to fetch articles' });
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM articles WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(`Error fetching article with ID ${id}:`, err);
      return res.status(500).json({ error: 'Failed to fetch article' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(results[0]);
  });
});

router.post('/', uploadArticleImage, (req, res) => {
  // req.file akan berisi informasi tentang file yang diunggah
  // req.body akan berisi data form lainnya (judul_artikel, isi_artikel, author_id)
  const { judul_artikel, isi_artikel, nama_author } = req.body;
  const gambar_artikel = req.file ? `/uploads/articles/${req.file.filename}` : null; // Simpan path relatif

  if (!judul_artikel || !isi_artikel) {
    // Jika ada file terupload tapi ada error validasi, hapus filenya
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const query = 'INSERT INTO articles (judul_artikel, isi_artikel, gambar_artikel, nama_author) VALUES (?, ?, ?, ?)';
  db.query(query, [judul_artikel, isi_artikel, gambar_artikel, nama_author], (err, results) => {
    if (err) {
      // Jika ada error database, hapus filenya
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('Error adding article:', err);
      return res.status(500).json({ error: 'Failed to add article' });
    }
    res.status(201).json({ message: 'Article added successfully', id: results.insertId, imagePath: gambar_artikel });
  });
});

router.put('/:id', uploadArticleImage, (req, res) => {
  const { id } = req.params;
  const { judul_artikel, isi_artikel, nama_author } = req.body;
  let gambar_artikel_path = req.body.gambar_artikel; // Ambil path lama jika tidak ada upload baru

  // Jika ada file baru diunggah, gunakan path baru dan hapus file lama (opsional, tergantung kebutuhan)
  if (req.file) {
    gambar_artikel_path = `/uploads/articles/${req.file.filename}`;
    // TODO: Opsional: Hapus gambar lama dari server jika tidak lagi dibutuhkan.
    // Anda perlu melakukan query ke DB untuk mendapatkan nama file lama sebelum update,
    // lalu menggunakan fs.unlinkSync untuk menghapusnya.
  }

  const query = 'UPDATE articles SET judul_artikel = ?, isi_artikel = ?, gambar_artikel = ?, nama_author = ? WHERE id = ?';
  db.query(query, [judul_artikel, isi_artikel, gambar_artikel_path, nama_author, id], (err, results) => {
    if (err) {
      // Jika ada error database setelah upload file baru, hapus file baru tersebut
      if (req.file) fs.unlinkSync(req.file.path);
      console.error(`Error updating article with ID ${id}:`, err);
      return res.status(500).json({ error: 'Failed to update article' });
    }
    if (results.affectedRows === 0) {
      // Jika artikel tidak ditemukan, hapus file baru jika terupload
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Article not found or no changes made' });
    }
    res.json({ message: 'Article updated successfully', imagePath: gambar_artikel_path });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Langkah 1: Dapatkan nama file gambar dari database sebelum menghapus record
  db.query('SELECT gambar_artikel FROM articles WHERE id = ?', [id], (err, results) => {
      if (err) {
          console.error(`Error fetching image path for article ID ${id}:`, err);
          return res.status(500).json({ error: 'Failed to delete article (DB error during path retrieval)' });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Article not found' });
      }

      const imagePathToDelete = results[0].gambar_artikel;

      // Langkah 2: Hapus record dari database
      db.query('DELETE FROM articles WHERE id = ?', [id], (err, deleteResults) => {
          if (err) {
              console.error(`Error deleting article with ID ${id}:`, err);
              return res.status(500).json({ error: 'Failed to delete article (DB error during deletion)' });
          }
          if (deleteResults.affectedRows === 0) {
              return res.status(404).json({ message: 'Article not found after deletion attempt' });
          }

          // Langkah 3: Hapus file gambar dari direktori lokal jika ada
          if (imagePathToDelete) {
              const fullPath = path.join(__dirname, '..', imagePathToDelete); // Construct full path
              fs.unlink(fullPath, (unlinkErr) => { // Menggunakan fs.unlink asinkron
                  if (unlinkErr) {
                      console.error(`Error deleting image file ${fullPath}:`, unlinkErr);
                      // Tidak mengembalikan error ke klien karena data DB sudah dihapus
                  } else {
                      console.log(`Image file ${fullPath} deleted successfully.`);
                  }
              });
          }
          res.json({ message: 'Article and associated image deleted successfully' });
      });
  });
});

module.exports = router;