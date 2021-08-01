const mongoose = require('mongoose');

module.exports = function () {

    /* Fixing all deprecationWarning of mongoDB */
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    
    /* Connection to database */
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch((error) => console.log(`${error}, could not connect to MongoDB`));
}