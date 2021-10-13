/**
 * Tells the file type (in string format) of the file recieved in parameters.
 * @param {*} file File whose file type (fileType/extension) is to be returned.
 * @returns File type of the file taken in parameter.
 */
module.exports = getFileType = (file) => {
    return file.mimetype.split('/')[0];
}