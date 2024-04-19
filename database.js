import mysql from 'mysql2/promise';

const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
});

export default pool;

// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'yourUsername',
//   password: 'yourPassword',
//   database: 'yourDatabaseName'
// });

// export default pool;
// const mysql = require('mysql2');
// // const pool = mysql.createPool({
// //   host: 'localhost',
// //   user: 'root', // Default XAMPP user
// //   password: '', // Default XAMPP password is empty
// //   database: 'project_db'
// // });
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
//   }).promise(); // Note the .promise() for promise support
  

// module.exports = pool;