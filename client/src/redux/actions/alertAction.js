import { TYPES } from "./TYPES";

export const setAlert = (payload) => {

    return ({
        type: TYPES.ALERT,
        payload: payload
    });

}