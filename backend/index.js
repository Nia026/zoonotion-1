const express = require('express');
const app = express(); 

const router = require('./router');
app.use('/', router); 

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});