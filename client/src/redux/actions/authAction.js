import { postDataAPI } from "../../utils/fetchData";
import valid from "../../utils/validate/register";
import { setAlert } from "./alertAction";


export const login = (data) => async (dispatch) => {
    try {

        const res = await postDataAPI('auth/login', data);
        dispatch({
            type: 'AUTH', payload: {
                user: res.data.user,
                token: res.data.access_token
            }
        })

    } catch (err) {

        const status = err.request.status;
        const errRecieved = {};
        if (status === 400 || status === 401 || status === 404) {
            const param = err.response.data.param;
            const message = err.response.data.msg;
            if (param !== 'password') errRecieved.usernameOrEmail = message;
            else errRecieved.password = message;
        } else {
            errRecieved.loginError = 'Login request failed. Pease try again.';
        }
        dispatch(setAlert(errRecieved));

    }
}


export const refreshToken = () => async (dispatch) => {
    try {

        const res = await postDataAPI('auth/refresh_token');
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


export const register = (data) => async (dispatch) => {

    const errorsInUserData = valid(data);
    if (errorsInUserData.errLength !== 0) {
        dispatch(setAlert(errorsInUserData.err));
        return;
    }

    const newUserData = {
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: data.newPassword,
        gender: data.gender
    };


    try {

        const res = await postDataAPI('auth/register', newUserData);
        dispatch({
            type: 'AUTH', payload: {
                user: res.data.user,
                token: res.data.access_token
            }
        })

    } catch (err) {

        const status = err.request.status;
        const errRecieved = {};
        if (status === 400 || status === 409) {
            const param = err.response.data.param;
            const message = err.response.data.msg;
            if (param === 'fullName') errRecieved.fullName = message;
            else if (param === 'username') errRecieved.username = message;
            else if (param === 'email') errRecieved.email = message;
            else if (param === 'password') errRecieved.password = message;
            else if (param === 'gender') errRecieved.gender = message;
        } else {
            errRecieved.registerError = 'Register request failed. Pease try again.';
        }
        dispatch(setAlert(errRecieved));

    }
}