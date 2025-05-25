const mysql = require('mysql');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zoonotion'
};

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
  if (err) {
    
    console.error('Failed to connect to MySQL database:', err.stack);
    console.error('Please check your database configuration in backend/config/db.js (host, user, password, database name).');
    return;
  }
  
  console.log(`Successfully connected to MySQL database: ${dbConfig.database}`);
  connection.release(); 
});

module.exports = pool;