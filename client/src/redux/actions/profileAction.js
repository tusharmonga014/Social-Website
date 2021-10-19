import { getDataAPI, patchDataAPI } from "../../utils/fetchData";
import { setAlert } from "./alertAction";
import { TYPES, DeleteDataById } from "./TYPES";

export const PROFILE_TYPES = {

    LOADING: 'LOADING_PROFILE',
    GET_USER: 'GET_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    GET_ID: 'GET_ID'

}


export const getProfileUsers = (id, auth) => async (dispatch) => {

    dispatch({
        type: PROFILE_TYPES.GET_ID,
        payload: id
    });


    try {

        dispatch({
            type: PROFILE_TYPES.LOADING,
            payload: true
        });


        const res = await getDataAPI(`user/get-user/${id}`, auth.token);
        const usersData = res.data;


        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: usersData
        });


        dispatch({
            type: PROFILE_TYPES.LOADING,
            payload: false
        });


    } catch (err) {

        dispatch(setAlert({ getProfileUsersError: err.response.data.msg }));
    }

}


export const follow = ({ users, user, auth, socket }) => async (dispatch) => {

    let newUser;

    /* If user doesn"t exist in users */
    if (users.every(item => item._id !== user._id)) {
        newUser = { ...user, followers: [...user.followers, auth.user] };
    } else {
        users.forEach(item => {
            if (item._id === user._id) {
                newUser = { ...item, followers: [...item.followers, auth.user] };
            }
        });
    }

    dispatch({
        type: PROFILE_TYPES.FOLLOW,
        payload: newUser
    });

    dispatch({
        type: TYPES.AUTH,
        payload: {
            ...auth,
            user: { ...auth.user, following: [...auth.user.following, newUser] }
        }
    });


    try {

        // const res = await patchDataAPI(`user/${user._id}/follow`, null, auth.token)
        await patchDataAPI(`user/${user._id}/follow`, null, auth.token);
        // socket.emit("follow", res.data.newUser)

        // Notify
        // const msg = {
        //     id: auth.user._id,
        //     text: "has started to follow you.",
        //     recipients: [newUser._id],
        //     url: `/profile/${auth.user._id}`,
        // }

        // dispatch(createNotify({ msg, auth, socket }))

    } catch (err) {

        dispatch({
            type: TYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
}


export const unfollow = ({ users, user, auth, socket }) => async (dispatch) => {

    let newUser;

    if (users.every(item => item._id !== user._id)) {
        newUser = { ...user, followers: DeleteDataById(user.followers, auth.user._id) }
    } else {
        users.forEach(item => {
            if (item._id === user._id) {
                newUser = { ...item, followers: DeleteDataById(item.followers, auth.user._id) }
            }
        });
    }

    dispatch({
        type: PROFILE_TYPES.UNFOLLOW,
        payload: newUser
    });

    dispatch({
        type: TYPES.AUTH,
        payload: {
            ...auth,
            user: {
                ...auth.user,
                following: DeleteDataById(auth.user.following, newUser._id)
            }
        }
    });


    try {

        // const res = await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token)
        await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token);
        // socket.emit("unFollow", res.data.newUser)

    } catch (err) {

        dispatch({
            type: TYPES.ALERT,
            payload: { error: err.response.data.msg }
        });

    }

}