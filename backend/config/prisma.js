// backend/config/prisma.js
require('dotenv').config();                   // biar env vars (DATABASE_URL) terbaca
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
