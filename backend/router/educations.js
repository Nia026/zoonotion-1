const express = require('express');
const router = express.Router(); 
const db = require('../config/db');
const uploadFile = require('../config/multerConfig');
const fs = require('fs');
const path = require('path');

const uploadEducationImage = uploadFile('educations').single('gambar_hewan');

router.get('/', (req, res) => {
  db.query('SELECT * FROM educations ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching educations:', err);
      return res.status(500).json({ error: 'Failed to fetch educations' });
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM educations WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(`Error fetching education with ID ${id}:`, err);
      return res.status(500).json({ error: 'Failed to fetch education' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Education data not found' });
    }
    res.json(results[0]);
  });
});

router.post('/', uploadEducationImage, (req, res) => {
  const { nama_hewan, deskripsi_hewan, kategori_hewan } = req.body;
  const gambar_hewan_path = req.file ? `/uploads/educations/${req.file.filename}` : null; // Simpan path relatif

  if (!nama_hewan || !deskripsi_hewan || !kategori_hewan) {
    if (req.file) fs.unlinkSync(req.file.path); // Hapus file jika ada error validasi
    return res.status(400).json({ message: 'Nama hewan, deskripsi, and kategori are required' });
  }

  const query = 'INSERT INTO educations (nama_hewan, deskripsi_hewan, kategori_hewan, gambar_hewan) VALUES (?, ?, ?, ?)';
  db.query(query, [nama_hewan, deskripsi_hewan, kategori_hewan, gambar_hewan_path], (err, results) => {
    if (err) {
      if (req.file) fs.unlinkSync(req.file.path); // Hapus file jika ada error database
      console.error('Error adding education:', err);
      return res.status(500).json({ error: 'Failed to add education' });
    }
    res.status(201).json({ message: 'Education data added successfully', id: results.insertId, imagePath: gambar_hewan_path });
  });
});

router.put('/:id', uploadEducationImage, (req, res) => {
  const { id } = req.params;
  const { nama_hewan, deskripsi_hewan, kategori_hewan } = req.body;
  let gambar_hewan_path = req.body.gambar_hewan; // Ambil path lama jika tidak ada upload baru

  if (req.file) {
    gambar_hewan_path = `/uploads/educations/${req.file.filename}`;
    // TODO: Opsional: Hapus gambar lama dari server jika tidak lagi dibutuhkan.
    // Anda perlu melakukan query ke DB untuk mendapatkan nama file lama sebelum update,
    // lalu menggunakan fs.unlinkSync untuk menghapusnya.
  }

  const query = 'UPDATE educations SET nama_hewan = ?, deskripsi_hewan = ?, kategori_hewan = ?, gambar_hewan = ? WHERE id = ?';
  db.query(query, [nama_hewan, deskripsi_hewan, kategori_hewan, gambar_hewan_path, id], (err, results) => {
    if (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      console.error(`Error updating education with ID ${id}:`, err);
      return res.status(500).json({ error: 'Failed to update education' });
    }
    if (results.affectedRows === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Education data not found or no changes made' });
    }
    res.json({ message: 'Education data updated successfully', imagePath: gambar_hewan_path });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT gambar_hewan FROM educations WHERE id = ?', [id], (err, results) => {
      if (err) {
          console.error(`Error fetching image path for education ID ${id}:`, err);
          return res.status(500).json({ error: 'Failed to delete education (DB error during path retrieval)' });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Education data not found' });
      }

      const imagePathToDelete = results[0].gambar_hewan;

      db.query('DELETE FROM educations WHERE id = ?', [id], (err, deleteResults) => {
          if (err) {
              console.error(`Error deleting education with ID ${id}:`, err);
              return res.status(500).json({ error: 'Failed to delete education (DB error during deletion)' });
          }
          if (deleteResults.affectedRows === 0) {
              return res.status(404).json({ message: 'Education data not found after deletion attempt' });
          }

          if (imagePathToDelete) {
              const fullPath = path.join(__dirname, '..', imagePathToDelete);
              fs.unlink(fullPath, (unlinkErr) => {
                  if (unlinkErr) {
                      console.error(`Error deleting image file ${fullPath}:`, unlinkErr);
                  } else {
                      console.log(`Image file ${fullPath} deleted successfully.`);
                  }
              });
          }
          res.json({ message: 'Education data and associated image deleted successfully' });
      });
  });
});

module.exports = router; 