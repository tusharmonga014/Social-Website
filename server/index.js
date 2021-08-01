const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); //url of react app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server Running on ${PORT}`);
})