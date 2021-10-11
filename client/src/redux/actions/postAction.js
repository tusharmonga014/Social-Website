import { postDataAPI } from "../../utils/fetchData"
import { setAlert } from "./alertAction";

export const POST_TYPES = {

    NEW_POST_MODAL: 'NEW_POST_MODAL',
    POST_UPLOADING: 'POST_UPLOADING',
    POST_UPLOADED: 'POST_UPLOADED'

}


export const createPost = (content, images, auth) => async (dispatch) => {

    dispatch({
        type: POST_TYPES.POST_UPLOADING,
        payload: true
    });


    try {

        const formData = new FormData();
        images.forEach(image => {
            formData.append("images", image);
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