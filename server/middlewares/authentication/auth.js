const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {

        /** Access token recived in request. */
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ msg: 'Please login to continue.' });


        /** Decoded access token. */
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        if (!decoded) return res.status(401).json({ msg: 'Please login to continue.' });


        /** Gettig the user through decoded access token's id. */
        const user = await User.findOne({ _id: decoded._id });


        /* Setting the user in req */
        req.user = user;
        next();


    } catch (err) {

        return res.status(500).json({ msg: err.message });
    }
}

module.exports = auth;