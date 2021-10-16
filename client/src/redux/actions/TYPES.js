export const TYPES = {

    AUTH: 'AUTH',
    ALERT: 'ALERT'

}

/**
 * Deletes a specific element from a data array with matching id.
 * @param {Array} data Data from which a specific element needs to be removed.
 * @param {*} id Id for specific element which is to be removed from data.
 * @returns Data with the element deleted.
 */
export const DeleteDataById = (data, id) => {
    const newData = data.filter(item => item._id !== id)
    return newData;
}

/**
 * Updates a specific element from a data array or adds one if not present in data array.
 * @param {Array} originalData Data in which a specific element needs to be updated.
 * @param {*} id Id for specific element which is to be removed from data.
 * @param {*} data Element with which original element needs to be relaced with.
 * @returns Data with the element updated.
 */
export const EditData = (originalData, id, element) => {

    /** New data which will have the updated element. */
    let newData = [...originalData];
    let elementIndex = newData.findIndex((ele => ele._id === id));
    if (elementIndex !== -1) newData[elementIndex] = element;
    else newData.push(element);

    return newData;
}

/**
  * Deletes a specific element from a data array.
  * @param {Array} data Data from which a specific element needs to be removed.
  * @param {*} ele Specific element which is to be removed from data.
  * @returns Data with the element deleted.
  */
export const DeleteData = (data, ele) => {
    const newData = data.filter(item => item !== ele)
    return newData;
}

/**
 * Returns a new array with updated element if present.
 * @param {Array} data Original data array.
 * @param {*} id Id of the element to be updated if present.
 * @param {*} element Element to be updated if present.
 * @returns New array with updated element if it was present.
 */
export const updateDataIfElementPresent = (data, id, element) => {
    /** New data which will have the updated element if its present. */
    let newData = [...data];
    let elementIndex = newData.findIndex((ele => ele._id === id));
    if (elementIndex !== -1) newData[elementIndex] = { ...element };
    return newData;
}