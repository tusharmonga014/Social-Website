require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();

/* Connects to database */
require('./startup/db')();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

/* Routes */
app.use('/api', routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
})