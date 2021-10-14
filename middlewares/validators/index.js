const { validationResult } = require('express-validator');
const loginValidationRules = require('./auth/loginValidationRules');
const registerValidationRules = require('./auth/registerValidationRules');
const newCommentValidationRules = require('./comment/newCommentValidationRules');
const updateCommentValidationRules = require('./comment/updateCommentValidationRules');
const newPostValidationRules = require('./post/newPostValidationRules');


/**
 * Returns the request route path.
 * @param {Object} req - Request Object for middleware
 * @returns Request route path
 */
const getReqRoute = (req) => {
    try {

        /** Will contain the whole url of a req, example: register user - /api/auth/register. */
        const routePath = req.originalUrl;
        /** Route path with starting '/' removed. */
        const routePathWithoutStartingSlash = routePath.substring(1);
        /** Starting index of route path after 'api/'. */
        const reqRouteStartIndex = routePathWithoutStartingSlash.indexOf('/') + 1;
        /** Route path to be returned. */
        const reqRoute = routePathWithoutStartingSlash.substring(reqRouteStartIndex);
        /** Length. */
        const length = reqRoute.length;
        /** Route path with ending '/' removed. */
        const routePathWithoutEndingSlash = reqRoute.charAt(length - 1) === '/' ?
            reqRoute.substring(0, length - 1) : reqRoute;
        /* Returning the route path */
        return routePathWithoutEndingSlash;

    } catch (err) {

        console.error(err);
        throw new Error("Could not get the req's route path.");

    }
}



/**
 * Returns requested route's validation rules array.
 * @param req - Request object
 * @returns   - Requested route's validation rules array
 */
const getReqRouteValidationRules = (req) => {
    let reqRoute = '';

    try { reqRoute = getReqRoute(req); }
    catch (err) { throw new Error(err.message); }

    try { return require(`./${reqRoute}`); }
    catch (err) {
        console.error(err);
        throw new Error('Error reading validation rules.');
    }
}



/**
 * Validates the request's data on the defined rules in 
 * the requested route's path's rules in its validator.
 */
const validator = (validationRules) => {

    // let reqRoute__ValidationRules = [];
    // try { reqRoute__ValidationRules = (getReqRouteValidationRules(req)); }
    // catch (err) { return res.status(500).json({ msg: err.message }); }

    return async (req, res, next) => {

        for (let validation of validationRules) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) return next();

        res.status(400).json(errors.array()[0]);
    }
}



/** Object containing different validator to call their validation rules. */
const validateData = {


    /* Register user validator */
    register: validator(registerValidationRules),


    /* Login user validator */
    login: validator(loginValidationRules),


    /* Post creation validator */
    createPost: validator(newPostValidationRules),


    /* Comment creation validator */
    createComment: validator(newCommentValidationRules),


    /* Comment updation validator */
    updateComment: validator(updateCommentValidationRules)


};



module.exports = validateData;