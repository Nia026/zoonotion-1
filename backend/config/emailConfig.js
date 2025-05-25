const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'niarfebriar@gmail.com', 
    pass: 'hhumpzwubtvkrfdz'
  }
});

module.exports = transporter; 