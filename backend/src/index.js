require('dotenv').config();

const express = require('express');

const cors = require('cors');

const bodyParser = require('body-parser');

const { registerFont } = require('canvas');

const connectDB = require('./db');

const { makeDirs } = require('./helpers');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());

app.use(express.static('src/assets'));

registerFont('./src/assets/fonts/Roboto-Regular.ttf', { family: 'Roboto' });

app.use('/api', require('./routes/api'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  makeDirs();

  connectDB();
});
