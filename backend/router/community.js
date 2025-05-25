const express = require('express');
const router = express.Router(); 
const db = require('../config/db');
const uploadFile = require('../config/multerConfig');
const fs = require('fs');
const path = require('path');

const uploadCommunityBanner = uploadFile('communities').single('banner_komunitas');

router.get('/', (req, res) => {
  db.query('SELECT * FROM communities ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching communities:', err);
      return res.status(500).json({ error: 'Failed to fetch communities' });
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM communities WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(`Error fetching community with ID ${id}:`, err);
      return res.status(500).json({ error: 'Failed to fetch community' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Community not found' });
    }
    res.json(results[0]);
  });
});

router.post('/', uploadCommunityBanner, (req, res) => {
  const { nama_komunitas, nama_penyelenggara, tahun_penyelenggara, deskripsi_komunitas } = req.body;
  const banner_komunitas = req.file ? `/uploads/communities/${req.file.filename}` : null;

  if (!nama_komunitas || !nama_penyelenggara || !tahun_penyelenggara) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const query = `
    INSERT INTO communities 
    (banner_komunitas, nama_komunitas, nama_penyelenggara, tahun_penyelenggara, deskripsi_komunitas, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  db.query(query, [banner_komunitas, nama_komunitas, nama_penyelenggara, tahun_penyelenggara, deskripsi_komunitas], (err, results) => {
    if (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('Error adding community:', err);
      return res.status(500).json({ error: 'Failed to add community' });
    }
    res.status(201).json({ message: 'Community added successfully', id: results.insertId });
  });
});

router.put('/:id', uploadCommunityBanner, (req, res) => {
  const { id } = req.params;
  const { nama_komunitas, nama_penyelenggara, tahun_penyelenggara, deskripsi_komunitas } = req.body;
  let bannerPath = req.body.banner_komunitas;

  if (req.file) {
    bannerPath = `/uploads/communities/${req.file.filename}`;
  }

  const query = `
    UPDATE communities SET 
    banner_komunitas = ?, nama_komunitas = ?, nama_penyelenggara = ?, 
    tahun_penyelenggara = ?, deskripsi_komunitas = ?
    WHERE id = ?
  `;
  db.query(query, [bannerPath, nama_komunitas, nama_penyelenggara, tahun_penyelenggara, deskripsi_komunitas, id], (err, results) => {
    if (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('Error updating community:', err);
      return res.status(500).json({ error: 'Failed to update community' });
    }
    if (results.affectedRows === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Community not found' });
    }
    res.json({ message: 'Community updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT banner_komunitas FROM communities WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching banner path:', err);
      return res.status(500).json({ error: 'Failed to delete community (banner fetch failed)' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const bannerPath = results[0].banner_komunitas;

    db.query('DELETE FROM communities WHERE id = ?', [id], (err, deleteResults) => {
      if (err) {
        console.error('Error deleting community:', err);
        return res.status(500).json({ error: 'Failed to delete community' });
      }

      if (bannerPath) {
        const fullPath = path.join(__dirname, '..', bannerPath);
        fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting banner file:', unlinkErr);
          }
        });
      }

      res.json({ message: 'Community deleted successfully' });
    });
  });
});

module.exports = router; 