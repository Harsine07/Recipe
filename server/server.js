const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const recipeRoutes = require('./routes/recipeRoutes');
const createRecipesTable = require('./models/setupTable');
require('dotenv').config();


const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/api', recipeRoutes);

createRecipesTable();

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
