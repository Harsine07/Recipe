const pool = require('../db');

const searchRecipes = async (filters, page = 1, limit = 50) => {
  let queryBase = ' FROM recipes WHERE 1=1';
  const values = [];
  let idx = 1;

  
  if (filters.calories) {
    const match = filters.calories.match(/(<=|>=|=|<|>)(\d+)/);
    if (match) {
      const operator = match[1];
      const calValue = match[2];
      queryBase += ` AND nutrients->>'calories' IS NOT NULL AND CAST(nutrients->>'calories' AS TEXT) ~ '^[0-9]+' AND CAST(regexp_replace(nutrients->>'calories', '[^0-9]', '', 'g') AS INTEGER) ${operator} $${idx}`;
      values.push(calValue);
      idx++;
    }
  }

  if (filters.title) {
    queryBase += ` AND LOWER(title) LIKE LOWER($${idx})`;
    values.push(`%${filters.title}%`);
    idx++;
  }

  
  if (filters.cuisine) {
    queryBase += ` AND LOWER(cuisine) LIKE LOWER($${idx})`;
    values.push(`%${filters.cuisine}%`);
    idx++;
  }


  if (filters.total_time) {
    const match = filters.total_time.match(/(<=|>=|=|<|>)(\d+)/);
    if (match) {
      const operator = match[1];
      const timeValue = match[2];
      queryBase += ` AND total_time ${operator} $${idx}`;
      values.push(timeValue);
      idx++;
    }
  }

  
  if (filters.rating) {
    const match = filters.rating.match(/(<=|>=|=|<|>)([\d.]+)/);
    if (match) {
      const operator = match[1];
      const ratingValue = match[2];
      queryBase += ` AND rating IS NOT NULL AND rating ${operator} $${idx}`;
      values.push(ratingValue);
      idx++;
    }
  }

  const countQuery = `SELECT COUNT(*)${queryBase}`;
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count);

  
  const offset = (page - 1) * limit;

  
  const dataQuery = `SELECT *${queryBase} ORDER BY rating DESC NULLS LAST, id ASC LIMIT $${idx} OFFSET $${idx + 1}`;
  values.push(limit, offset);

  console.log('filters', filters);
  console.log('Executing data query:', dataQuery, values);

  const dataResult = await pool.query(dataQuery, values);

  return {
    page,
    limit,
    total,
    data: dataResult.rows,
  };
};

module.exports = { searchRecipes };
