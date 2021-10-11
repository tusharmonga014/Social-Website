const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const stream = (resolve, reject, fileType, cloudinaryPublicId) => cloudinary.uploader.upload_stream(
    {
        public_id: cloudinaryPublicId,
        resource_type: fileType
    },
    (error, result) => {
        if (result) resolve(result);
        else reject(error);
    }
);


/**
 * Uploads a file to the cloudinary, returns resolve/reject.
 * @param {*} fileBuffer File to be uploaded in buffer array form.
 * @param {String} fileType The type of file to be uploaded, image or video.
 * @param {String} cloudinaryPublicId public_id to be set for the file in cloudinary. 
 * @returns The result object after uploading the file.
 */
const cloudinaryFileUpload = (fileBuffer, fileType, cloudinaryPublicId) => {
    return new Promise((resolve, reject) => {
        streamifier.createReadStream(fileBuffer).pipe(stream(resolve, reject, fileType, cloudinaryPublicId));
    });
};


/**
 * Converts media file to buffer array, uploads it to cloudinary and returns the response.
 * @param {*} file File to be uploaded.
 * @param {String} cloudinaryPublicId public_id to be set for the file in cloudinary.
 * @returns Response from cloudinary.
 */
const cloudinaryUploadMediaFile = async (file, cloudinaryPublicId) => {
    const fileBuffer = file.data;
    const fileType = file.mimetype.substring(0, 5) === 'image' ? 'image' : 'video';
    const response = await cloudinaryFileUpload(fileBuffer, fileType, cloudinaryPublicId);
    return response;
}


module.exports = cloudinaryUploadMediaFile;