const cloudinary = require('cloudinary').v2;


/**
 * Deletes files from the cloudinary.
 * @param {[String]} cloudinaryPublicIds public_ids of the files to be deleted.
 * @param {String} fileType Type of files in the array
 * @returns Response from cloudinary.
 */
const cloudinaryDeleteFile = (cloudinaryPublicIds, fileType) => {
    return new Promise((resolve, reject) => {
        cloudinary.api.delete_resources(
            cloudinaryPublicIds,
            {
                resource_type: fileType
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
    });
}


module.exports = cloudinaryDeleteFile;