const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* Connects to database */
require('./startup/db')();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Running on ${port}`);
})