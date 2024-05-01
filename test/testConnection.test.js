import pool from '../src/database.js';  // Update the import path according to your project structure

describe('Database Connectivity Test', () => {
  it('should connect to the database and perform a simple query', async () => {
    const [results] = await pool.query('SELECT 1 + 1 AS solution');
    expect(results[0].solution).toBe(2);
  });

  afterAll(async () => {
    await pool.end();  // Optionally close pool after test run
  });
});
