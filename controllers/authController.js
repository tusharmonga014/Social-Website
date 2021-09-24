const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {

    register: async (req, res) => {

        try {

            /** User's (VALIDATED) data in request's body. */
            const userData = req.body;
            /* username, email password from user data */
            const { username, email, password } = userData;



            /** User with same username as provided for the new user being registered. */
            const existingUserUsername = await User.findOne({ username }); // catch block, 500 error
            if (existingUserUsername) return res.status(409).json({ param: "username", msg: 'This username is already taken.' });



            /** User with same email as provided for the new user being registered. */
            const existingUserEmail = await User.findOne({ email }); // catch block, 500 error
            if (existingUserEmail) return res.status(409).json({ param: "email", msg: 'This email already exists.' });



            /** Password hashed by bcrypt. */
            const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
            userData.password = passwordHash;



            /** New user document with all the provided fields. */
            const newUser = new User(userData);
            /* Saving the new user */
            await newUser.save()



            /** User data which needs to be sent with reponse */
            const userDataResponse = newUser._doc;
            /* Password should not be sent back in response*/
            delete userDataResponse.password;



            /** Access Token for authentication. */
            const access_token = createAccessToken({ _id: newUser._id });
            /** Refesh Token for generating new access_token when current access token expires. */
            const refresh_token = createRefreshToken({ _id: newUser._id });



            /* https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#JavaScript_access_using_Document.cookie */
            const refreshTokenCookieOptions = {
                httpOnly: true, // Use the HttpOnly attribute to prevent access to cookie values via JavaScript
                path: '/api/auth/refresh_token', // Cookie will only come with req, when on this api endpoint
                // secure: true, // For only https
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            };
            const response = {
                message: 'User registered.',
                access_token,
                user: userDataResponse
            };



            /* Setting the cookie for refresh token, for when access_token expires */
            res.cookie('refreshtoken', refresh_token, refreshTokenCookieOptions);
            /* Sending back the response with acces token and new user's data */
            res.json(response);


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }


    },



    login: async (req, res) => {

        try {

            /** Username/Email, Password recieved in the req's body. */
            const { usernameOrEmail, password } = req.body;



            /** User to be returned if found. */
            let user = {};



            /** Email regular expression. */
            const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            /** Determines whether email is passed or username. True : email, False : username. */
            const isEmail = emailRegex.test(usernameOrEmail);



            if (isEmail) {


                /** User with same email as provided by the user. */
                const existingUserEmail = await User.findOne({ email: usernameOrEmail }).populate('followers following', 'username fullName userImage'); // catch block, 500 error
                if (!existingUserEmail) return res.status(404).json({ param: 'usernameOrEmail', msg: 'Email is not registered.' });
                else user = existingUserEmail;


            } else {


                /** User with same username as provided by the user. */
                const existingUserUsername = await User.findOne({ username: usernameOrEmail }).populate('followers following', 'username fullName userImage'); // catch block, 500 error
                if (!existingUserUsername) return res.status(404).json({ param: 'usernameOrEmail', msg: 'Username is not registered.' });
                else user = existingUserUsername;


            }


            /** Boolean value which represents whether the passwords matched or not. */
            const passwordMatched = await bcrypt.compare(password, user.password);
            if (!passwordMatched) return res.status(401).json({ param: 'password', msg: 'Password does not match. Try Again.' });



            /** User data which needs to be sent with reponse */
            const userDataResponse = user._doc;
            /* Password should not be sent back in response*/
            delete userDataResponse.password;



            /** Access Token for authentication. */
            const access_token = createAccessToken({ _id: user._id });
            /** Refesh Token for generating new access_token when current access token expires. */
            const refresh_token = createRefreshToken({ _id: user._id });



            /* https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#JavaScript_access_using_Document.cookie */
            const refreshTokenCookieOptions = {
                httpOnly: true, // Use the HttpOnly attribute to prevent access to cookie values via JavaScript
                path: '/api/auth/refresh_token', // Cookie will only come with req, when on this api endpoint
                // secure: true, // For only https
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            };
            const response = {
                message: 'User Logged In.',
                access_token,
                user: userDataResponse
            };



            /* Setting the cookie for refresh token, for when access_token expires */
            res.cookie('refreshtoken', refresh_token, refreshTokenCookieOptions);
            /* Sending back the response with acces token and user's data */
            res.json(response);


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    logout: (req, res) => {

        try {

            /* Clearing the refresh token cookie */
            res.clearCookie('refreshtoken', { path: '/api/auth/refresh_token' });
            res.json({ msg: 'User Logged Out.' });

        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }
    },



    generateAccessTokenByRefreshToken: async (req, res) => {

        try {

            /** Refresh token from the cookies (using cookie-parser) sent along with request. */
            const refresh_token = req.cookies.refreshtoken;
            if (!refresh_token) return res.status(401).json({ msg: 'Please Login to Continue.' });



            /* Verifying the refresh token -> result : decoded object */
            jwt.verify(refresh_token, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, result) => {

                if (err) return res.status(401).json({ msg: err.message });



                /** User with same credentials as in refresh token of request. */
                const user = await User.findOne({ _id: result._id }).select('-password').populate('followers following', 'username fullName userImage'); // catch block, 500 error;
                if (!user) return res.status(401).json({ msg: 'Please Login to Continue.' });



                /** Access token for user. */
                const access_token = createAccessToken({ _id: user._id });


                /* Response with access token and user details */
                res.json({
                    access_token,
                    user
                });


            })


        } catch (err) {

            return res.status(500).json({ message: err.message });
        }


    }


}



/**
 * Creates an access token using jwt sign.
 * @param {*} payload An object or buffer, on which jwt will sign
 * @returns An access token for generating new access token
 */
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {});
}



/**
 * Creates a refresh token using jwt sign.
 * @param {*} payload An object or buffer, on which jwt will sign
 * @returns A refresh token for authentication when access token expires
 */
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {});
}



module.exports = authController;