export const TYPES = {

    AUTH: 'AUTH',
    ALERT: 'ALERT'

}

/**
 * Deletes a specific element from a data array.
 * @param {Array} data Data from which a specific element needs to be removed.
 * @param {*} id Id for specific element which is to be removed from data.
 * @returns Data with the element deleted.
 */
export const DeleteData = (data, id) => {
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