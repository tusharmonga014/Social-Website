const { body, check } = require('express-validator');

module.exports = [

    check('content')
        .custom((value, { req }) => {
            if (req.body.content) return true;
            else if (req.files.media) return true;
            else return false;
        })
        .withMessage('Post cannot be empty. Post should either include text or media.'),


    body('content').trim().replace(/ +(?= )/g, '')
        .isLength({ max: 500 })
        .withMessage('Post content can not be more than 500 characters long.'),


    check('media')
        .custom((value, { req }) => {
            if (!req.files) return true;
            if (req.files.media.length <= 10) return true;
            else if (req.files.media.name) return true;
            else return false;
        })
        .withMessage('Post cannot have more than 10 media files.')
        .bail()
        .custom((value, { req }) => {
            if (!req.files) return true;
            let correctType = true;
            if (req.files.media.length > 1) {
                for (let fileCounter = 0; fileCounter < req.files.media.length; fileCounter++) {
                    const file = req.files.media[fileCounter];
                    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'video/mp4') {
                        correctType = false;
                        break;
                    }
                }
            } else if (req.files.media) {
                const file = req.files.media;
                if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'video/mp4')
                    correctType = false;
            }
            return correctType;
        })
        .withMessage('Files are not in correct format. Formats allowed are (.jpeg/.jpg/.png/.mp4).')

];