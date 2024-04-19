// testConnection.js
import pool from './database.js';

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        console.log('The solution is: ', rows[0].solution);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
    pool.end(); // Cierra el pool después de la prueba
}

testConnection();
