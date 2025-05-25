const express = require('express');
const router = express.Router(); 
const db = require('../config/db');
const uploadFile = require('../config/multerConfig');
const fs = require('fs');
const path = require('path');

const uploadGalleryImages = uploadFile('galleries').array('gambar_galeri', 10); 

router.get('/', (req, res) => {
  db.query('SELECT * FROM galleries ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch gallery' });
    res.json(results);
  });
});

router.get('/community/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM galleries WHERE community_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch gallery' });
    res.json(results);
  });
});

router.post('/', uploadGalleryImages, (req, res) => {
  const { community_id, deskripsi_gambar } = req.body;

  if (!community_id || !req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Required fields missing or no files uploaded' });
  }

  const values = req.files.map(file => [
    community_id,
    `/uploads/galeri/${file.filename}`,
    deskripsi_gambar || null
  ]);

  const query = 'INSERT INTO galleries (community_id, gambar_galeri, deskripsi_gambar) VALUES ?';

  db.query(query, [values], (err, results) => {
    if (err) {
      console.error('MySQL Error:', err); // log detail error
      req.files.forEach(file => fs.unlinkSync(file.path));
      return res.status(500).json({ error: 'Failed to insert gallery images', details: err.message });
    }
    res.status(201).json({ message: 'Gallery images uploaded successfully', inserted: results.affectedRows });
  });
  
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT gambar_galeri FROM galleries WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching image' });
    if (results.length === 0) return res.status(404).json({ message: 'Gallery image not found' });

    const imagePath = results[0].gambar_galeri;
    const fullPath = path.join(__dirname, '..', imagePath);

    db.query('DELETE FROM galleries WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: 'Error deleting image from database' });

      fs.unlink(fullPath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });

      res.json({ message: 'Gallery image deleted successfully' });
    });
  });
});

module.exports = router;