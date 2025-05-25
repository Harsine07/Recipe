const pool = require('../db');

const getPaginatedRecipes = async (page, limit) => {
  const offset = (page - 1) * limit;

  const dataResult = await pool.query(
    'SELECT * FROM recipes ORDER BY rating DESC NULLS LAST LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  const countResult = await pool.query('SELECT COUNT(*) FROM recipes');

  return {
    page,
    limit,
    total: parseInt(countResult.rows[0].count),
    data: dataResult.rows,
  };
};

module.exports = {
  getPaginatedRecipes
};
