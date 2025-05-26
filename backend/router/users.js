const express = require('express');
const router = express.Router(); 
const db = require('../config/db');
const transporter = require('../config/emailConfig');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already registered' });

    db.query(
      'INSERT INTO users (username, email, password, otp_code) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, otp],
      async (err) => {
        if (err) return res.status(500).json({ error: 'Failed to register' });

        try {
          await transporter.sendMail({
            from: '"User Registration" <niarfebriar@gmail.com>',
            to: email,
            subject: 'Your OTP Code',
            html: `<h3>Your OTP Code: ${otp}</h3>`
          });
          res.status(200).json({ message: 'OTP sent to email' });
        } catch (emailErr) {
          res.status(500).json({ error: 'Failed to send OTP email' });
        }
      }
    );
  });
});

router.post('/verify-otp', (req, res) => {
  const { email, otp_code } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ? AND otp_code = ?',
    [email, otp_code],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(400).json({ message: 'Invalid OTP' });

      db.query(
        'UPDATE users SET is_verified = 1, otp_code = NULL WHERE email = ?',
        [email],
        (updateErr) => {
          if (updateErr) return res.status(500).json({ error: 'Verification failed' });
          res.status(200).json({ message: 'Email verified successfully' });
        }
      );
    }
  );
});

router.post('/login', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing username, email, or password' });
  }

  db.query(
    'SELECT * FROM users WHERE username = ? AND email = ?',
    [username, email],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(400).json({ message: 'User not found' });

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ error: 'Bcrypt error' });
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        if (!user.is_verified) return res.status(403).json({ message: 'Email not verified' });

        res.status(200).json({
          message: 'Login successful',
          user: { id: user.id, username: user.username }
        });
      });
    }
  );
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(400).json({ message: 'Email not registered' });

    db.query('UPDATE users SET otp_code = ? WHERE email = ?', [otp, email], async (updateErr) => {
      if (updateErr) return res.status(500).json({ error: 'Failed to set OTP' });

      try {
        await transporter.sendMail({
          from: '"Reset Password" <niarfebriar@gmail.com>',
          to: email,
          subject: 'Reset Password OTP',
          html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`
        });
        res.status(200).json({ message: 'OTP sent to email' });
      } catch (emailErr) {
        res.status(500).json({ error: 'Failed to send OTP email' });
      }
    });
  });
});

router.post('/verify-reset-otp', (req, res) => {
  const { email, otp_code } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ? AND otp_code = ?',
    [email, otp_code],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(400).json({ message: 'Invalid OTP or email' });

      res.status(200).json({ message: 'OTP verified successfully' });
    }
  );
});

router.post('/reset-password', (req, res) => {
  const { email, otp_code, new_password } = req.body;

  if (!email || !otp_code || !new_password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.query(
    'SELECT * FROM users WHERE email = ? AND otp_code = ?',
    [email, otp_code],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0)
        return res.status(400).json({ message: 'Invalid OTP or email' });

      bcrypt.hash(new_password, 10, (hashErr, hashedPassword) => {
        if (hashErr)
          return res.status(500).json({ error: 'Bcrypt hashing error' });

        db.query(
          'UPDATE users SET password = ?, otp_code = NULL WHERE email = ?',
          [hashedPassword, email],
          (updateErr) => {
            if (updateErr)
              return res.status(500).json({ error: 'Failed to update password' });

            res.status(200).json({ message: 'Password updated successfully' });
          }
        );
      });
    }
  );
});

module.exports = router; 