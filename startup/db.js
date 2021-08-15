const mongoose = require('mongoose');

module.exports = function () {

    /* Fixing all deprecationWarning of mongoDB */
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useUnifiedTopology', true);

    /** MongoDB connection URL. */
    const URL = process.env.MONGODB_URL;
    
    /* For offline, when in development */
    // const URL_localDB = 'mongodb://localhost:27017/socialWebsiteDB'

    /* Connection to database */
    mongoose.connect(URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error(`${err}, could not connect to MongoDB`));
}