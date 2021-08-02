const mongoose = require('mongoose');

module.exports = function () {

    /* Fixing all deprecationWarning of mongoDB */
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);

    /**
     * MongoDB connection URL
     */
    const URL = process.env.MONGODB_URL;

    /* Connection to database */
    mongoose.connect(URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch((error) => console.log(`${error}, could not connect to MongoDB`));
}