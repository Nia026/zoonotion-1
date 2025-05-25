const express = require('express');
const router = express.Router(); 
const db = require('../config/db');
const uploadFile = require('../config/multerConfig');
const fs = require('fs');
const path = require('path');

const uploadZooImage = uploadFile('zoos').single('gambar_zoo');

router.get('/', (req, res) => {
  db.query('SELECT * FROM zoos ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching zoos data:', err);
      return res.status(500).json({ error: 'Failed to fetch zoos data' });
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM zoos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(`Error fetching zoos with ID ${id}:`, err);
      return res.status(500).json({ error: 'Failed to fetch zoos' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Zoos not found' });
    }
    res.json(results[0]);
  });
});

router.post('/', uploadZooImage, (req, res) => {
  const { nama_kebun_binatang, deskripsi_kebun_binatang, link_web_resmi, link_tiket } = req.body;
  const gambar_zoo = req.file ? `/uploads/zoos/${req.file.filename}` : null;

  if (!nama_kebun_binatang || !deskripsi_kebun_binatang) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const query = `
    INSERT INTO zoos 
    (nama_kebun_binatang, deskripsi_kebun_binatang, link_web_resmi, link_tiket, gambar_zoo, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  db.query(query, [nama_kebun_binatang, deskripsi_kebun_binatang, link_web_resmi, link_tiket, gambar_zoo], (err, results) => {
    if (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('Error adding zoo:', err);
      return res.status(500).json({ error: 'Failed to add zoo' });
    }
    res.status(201).json({ message: 'Zoo added successfully', id: results.insertId });
  });
});

router.put('/:id', uploadZooImage, (req, res) => {
  const { id } = req.params;
  const { nama_kebun_binatang, deskripsi_kebun_binatang, link_web_resmi, link_tiket } = req.body;
  let gambarPath = req.body.gambar_zoo;

  if (req.file) {
    gambarPath = `/uploads/zoos/${req.file.filename}`;
  }

  const query = `
    UPDATE zoos SET 
    nama_kebun_binatang = ?, deskripsi_kebun_binatang = ?, 
    link_web_resmi = ?, link_tiket = ?, gambar_zoo = ?
    WHERE id = ?
  `;
  db.query(query, [nama_kebun_binatang, deskripsi_kebun_binatang, link_web_resmi, link_tiket, gambarPath, id], (err, results) => {
    if (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('Error updating zoo:', err);
      return res.status(500).json({ error: 'Failed to update zoo' });
    }
    if (results.affectedRows === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Zoo not found' });
    }
    res.json({ message: 'Zoo updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT gambar_zoo FROM zoos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching image path:', err);
      return res.status(500).json({ error: 'Failed to delete zoo (image fetch failed)' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Zoo not found' });
    }

    const gambarPath = results[0].gambar_zoo;

    db.query('DELETE FROM zoos WHERE id = ?', [id], (err, deleteResults) => {
      if (err) {
        console.error('Error deleting zoo:', err);
        return res.status(500).json({ error: 'Failed to delete zoo' });
      }

      if (gambarPath) {
        const fullPath = path.join(__dirname, '..', gambarPath);
        fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting image file:', unlinkErr);
          }
        });
      }

      res.json({ message: 'Zoo deleted successfully' });
    });
  });
});

module.exports = router;