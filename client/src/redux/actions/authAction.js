import { postDataAPI } from "../../utils/fetchData";

export const TYPES = {
    AUTH: 'AUTH'
}

export const login = (data) => async (dispatch) => {
    try {

        const res = await postDataAPI('auth/login', data, '');
        dispatch({
            type: 'AUTH', payload: {
                user: res.data.user,
                token: res.data.access_token
            }
        })

    } catch (err) {
        throw err;
    }
}

export const refreshToken = () => async (dispatch) => {
    try {

        const res = await postDataAPI('auth/refresh_token', '', '');
        dispatch({
            type: 'AUTH', payload: {
                user: res.data.user,
                token: res.data.access_token
            }
        })

    } catch (err) {
        throw err;
    }
}

