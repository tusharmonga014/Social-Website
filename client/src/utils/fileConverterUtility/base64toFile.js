/**
 * Converts base64 encoded to new file.
 * @param {String} dataURL base64-encoded file data.
 * @param {String} fileName Filename for new file created. 
 * @returns Newly created file.
 */
export default function dataURLtoFile(dataURL, fileName) {
    let arr = dataURL.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], fileName, { type: mime });
}