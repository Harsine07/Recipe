// models/setupTable.js
const pool = require('../db');

const createRecipesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      cuisine VARCHAR,
      title VARCHAR,
      rating FLOAT,
      prep_time INT,
      cook_time INT,
      total_time INT,
      description TEXT,
      nutrients JSONB,
      serves VARCHAR
    );
  `;

  try {
    await pool.query(query);
    console.log('✅ Table "recipes" is ready');
  } catch (err) {
    console.error('❌ Error creating table:', err.message);
  }
};

module.exports = createRecipesTable;
