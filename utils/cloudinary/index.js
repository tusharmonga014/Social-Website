const cloudinary = require('cloudinary').v2;
const fileUpload = require('./fileUpload');
const deleteFile = require('./deleteFile');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


module.exports = {
    cloudinaryUploadMediaFile: fileUpload,
    cloudinaryDeleteFile: deleteFile,
}