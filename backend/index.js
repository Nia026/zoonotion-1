const express = require('express');
const app = express(); 
const PORT = 5000;
const db = require('./config/db');
const cors = require('cors');
const path = require('path');
const articlesRouter = require('./router/articles');
const educationsRouter = require('./router/educations');
const communityRouter = require('./router/community');
const zoosRouter = require('./router/zoos');
const adminsRouter = require('./router/admins');
const usersRouter = require('./router/users');
const galeryRouter = require('./router/galeri');

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/articles', articlesRouter);
app.use('/api/educations', educationsRouter);
app.use('/api/community', communityRouter);
app.use('/api/zoos', zoosRouter); 
app.use('/api/admins', adminsRouter); 
app.use('/api/galery', galeryRouter);  
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});