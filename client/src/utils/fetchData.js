import axios from "axios";

/**
 * Gets data from the specified url from API.
 * @param {String} url - Url from which data needs to be fetched
 * @param {*} token    - Authorization token
 * @returns Response recieved from the API
 */
export const getDataAPI = async (url, token) => {
    try {
        const res = await axios.get(`/api/${url}`, {
            headers: { Authorization: token }
        })
        return res;
    } catch (err) {
        return err;
    }
}


/**
 * Posts data to the specified url from API.
 * @param {String} url - Url to which data needs to be fetched
 * @param {*} data     - Data which needs to be sent along with post request
 * @param {*} token    - Authorization token
 * @returns Response recieved from the API
 */
export const postDataAPI = async (url, data, token) => {
    try {
        const res = await axios.post(`/api/${url}`, data, {
            headers: { Authorization: token }
        })
        return res;
    } catch (err) {
        throw err;
    }
}


/**
 * Updates data requesting to the specified url from API.
 * @param {String} url - Url from which data needs to be fetched
 * @param {*} data     - Data which needs to be updated
 * @param {*} token    - Authorization token
 * @returns Response recieved from the API
 */
export const patchDataAPI = async (url, data, token) => {
    try {
        const res = await axios.patch(`/api/${url}`, data, {
            headers: { Authorization: token }
        })
        return res;
    } catch (err) {
        throw err;
    }
}


/**
 * Deletes data requesting to the specified url from API.
 * @param {String} url - Url from which data needs to be deleted
 * @param {*} token    - Authorization token
 * @returns Response recieved from the API
 */
export const deleteDataAPI = async (url, token) => {
    try {
        const res = await axios.delete(`/api/${url}`, {
            headers: { Authorization: token }
        })
        return res;
    } catch (err) {
        throw err;
    }
}