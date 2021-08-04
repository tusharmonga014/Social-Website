const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {

    register: async (req, res) => {

        try {

            /** User data in request's body. */
            const userData = req.body;



            /** Validated user data in standardized form. */
            let standardizedUserData = {};



            /* Validating user data and converting to standardized from */
            try { standardizedUserData = await validateAndStandardizeUserData(userData); }
            catch (err) { return res.status(400).json({ message: err.message }); }



            /* username, email password from user data */
            const { username, email, password } = standardizedUserData;



            /** User with same username as provided for the new user being registered. */
            const existingUserUsername = await User.findOne({ username }); // catch block, 500 error
            if (existingUserUsername) return res.status(400).json({ message: 'This username is already taken.' });



            /** User with same email as provided for the new user being registered. */
            const existingUserEmail = await User.findOne({ email }); // catch block, 500 error
            if (existingUserEmail) return res.status(400).json({ message: 'This email already exists.' });



            /** Password hashed by bcrypt. */
            const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
            standardizedUserData.password = passwordHash;



            /** New user document with all the provided fields. */
            const newUser = new User(standardizedUserData);
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

            return res.status(500).json({ message: err.message });
        }


    },



    login: (req, res) => {

    },



    logout: (req, res) => {

    },



    generateAccessTokenByRefreshToken: async (req, res) => {

        try {

            /** Refresh token from the cookies (using cookie-parser) sent along with request. */
            const refresh_token = req.cookies.refreshtoken;
            if (!refresh_token) return res.status(401).json({ message: 'Please Login to Continue.' });



            /* Verifying the refresh token -> result : decoded object */
            jwt.verify(refresh_token, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, result) => {

                if (err) return res.status(401).json({ message: err.message });



                /** User with same credentials as in refresh token of request. */
                const user = await User.findOne({ _id: result._id }).select('-password');
                if (!user) return res.status(401).json({ message: 'Please Login to Continue.' });



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
 * Validates the user data and converts it to standardized form.
 * @param {{
 * fullName: String, 
 * username: String,
 * email: String,
 * password: String,
 * gender: String
 * }} userData An object which contains user data
 * @returns Standardized user data
 */
const validateAndStandardizeUserData = async (userData) => {

    const { fullName, username, email, password, gender } = userData;


    /* Checking whether fullname is provided */
    if (!fullName) throw new Error('Full Name is required.');

    /** Fullname without any starting or ending spaces. */
    const standardizedFullName = fullName.trim();

    /* Checking the length for fullname */
    if (standardizedFullName.length > 25)
        throw new Error('Fullname can not be more than 25 characters.');



    /* Checking whether username is provided */
    if (!username) throw new Error('Username is required.');

    /** Username in lowercase without any spaces in between. */
    const standardizedUsername = username.toLowerCase().replace(/ /g, '');

    /* Checking the min length for username */
    if (standardizedUsername.length < 3)
        throw new Error('Username should be atleast 3 characters long.');

    /* Checking the max length for username */
    if (standardizedUsername.length > 25)
        throw new Error('Username can not be more than 25 characters.');



    /* Checking whether email is provided */
    if (!email) throw new Error('Email is required.');

    /** Email without any starting or ending spaces. */
    const standardizedEmail = email.trim();

    /* Checking whether email is valid */
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!(emailRegEx.test(standardizedEmail)))
        throw new Error('Invalid email address.');



    /* Checking whether password is provided */
    if (!password) throw new Error('Password is required.');

    /* Checking the minimum password length */
    if (password.length < 6)
        throw new Error('Password must be atleast 6 characters.');



    /* Checking whether password is provided */
    if (!gender) throw new Error('Gender is required.');

    /** Lower-cased gender provided by user. */
    const standardizedGender = gender.toLowerCase();

    /* It should be from the given options only */
    if (standardizedGender != 'male' && standardizedGender != 'female' && standardizedGender != 'others')
        throw new Error('Invalid gender.');



    /** Validated and Standardized user data. */
    const newUserData = {
        ...userData,
        fullName: standardizedFullName,
        username: standardizedUsername,
        email: standardizedEmail,
        gender: standardizedGender,
    }


    return (newUserData);

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