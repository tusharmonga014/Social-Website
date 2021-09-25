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
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '/client/build/public/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })


/* production build */
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    //  else  //   "proxy": "http://localhost:5000",
}


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
})