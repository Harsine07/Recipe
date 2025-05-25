const fs = require('fs');
const pool = require('../db');
const createTable = require('../models/setupTable');

const cleanData = (obj) => {
  if (Array.isArray(obj)) {
    const filtered = obj.filter(item => item !== null).map(cleanData);
    return filtered;
  } else if (obj !== null && typeof obj === 'object') {
    const cleaned = {};
    for (let key in obj) {
      const val = obj[key];
      cleaned[key] = (typeof val === 'number' && isNaN(val)) ? null : cleanData(val);
    }
    return cleaned;
  }
  return obj;
};

const insertRecipes = async (recipes) => {
  const query = `
    INSERT INTO recipes (
      cuisine, title, rating, prep_time,
      cook_time, total_time, description,
      nutrients, serves
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9
    );
  `;

  for (const recipe of recipes) {
    const {
      cuisine, title, rating, prep_time,
      cook_time, total_time, description,
      nutrients, serves
    } = recipe;

    if (!title) continue;
    const TotalTime = total_time === 0 ? null : total_time;


    await pool.query(query, [
      cuisine, title, rating, prep_time,
      cook_time, TotalTime, description,
      nutrients, serves
    ]);
  }

  console.log(`✅ Inserted ${recipes.length} recipes.`);
};

const loadData = async () => {
  await createTable();

  const rawData = fs.readFileSync('recipes.json', 'utf-8');
  const obj = JSON.parse(rawData);

  const recipesArray = Object.values(obj); // convert {"0": {...}} to [{...}, {...}]
  const cleaned = cleanData(recipesArray);

  try {
    await insertRecipes(cleaned);
    console.log('🚀 All recipes inserted successfully.');
  } catch (err) {
    console.error('❌ Error inserting recipes:', err.message);
  } finally {
    pool.end();
  }
};

loadData();
