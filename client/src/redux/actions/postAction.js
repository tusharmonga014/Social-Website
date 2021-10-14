import { postDataAPI, getDataAPI } from "../../utils/fetchData";
import { setAlert } from "./alertAction";

export const POST_TYPES = {

    NEW_POST_MODAL: 'NEW_POST_MODAL',
    POST_UPLOADING: 'POST_UPLOADING',
    POST_UPLOADED: 'POST_UPLOADED',
    POSTS_LOADING: 'POSTS_LOADING',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST'

}


export const createPost = (content, media, auth) => async (dispatch) => {

    dispatch({
        type: POST_TYPES.POST_UPLOADING,
        payload: true
    });


    try {

        const formData = new FormData();
        media.forEach(mediaFile => {
            formData.append("media", mediaFile);
        });
        formData.append("content", content);
        await postDataAPI('posts/create-post', formData, auth.token);

        dispatch({
            type: POST_TYPES.POST_UPLOADED,
            payload: true
        });


    } catch (err) {

        dispatch({
            type: POST_TYPES.POST_UPLOADED,
            payload: false
        });
        dispatch(setAlert({ newPostError: 'Post update failed, please try again.' }));
    }


    dispatch({
        type: POST_TYPES.POST_UPLOADING,
        payload: false
    });

}


export const getPosts = (auth, homePostsPage, limit) => async (dispatch) => {

    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: true
    });


    try {

        limit = limit || 9;

        const url = `posts/feed-posts?limit=${homePostsPage * limit}`;
        const res = await getDataAPI(url, auth.token);

        const { posts, result } = res.data;
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: { posts, result, page: homePostsPage + 1 }
        });


    } catch (err) {

        dispatch(setAlert({ postsError: 'Post update failed, please try again.' }));
    }


    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: false
    });

}