import { postDataAPI } from "../../utils/fetchData"
import { setAlert } from "./alertAction";

export const POST_TYPES = {

    NEW_POST_MODAL: 'NEW_POST_MODAL'

}


export const createPost = (content, images, auth) => async (dispatch) => {

    try {

        const formData = new FormData();
        images.forEach(image => {
            formData.append("images", image);
        });
        formData.append("content", content);
        await postDataAPI('posts/create-post', formData, auth.token);


    } catch (err) {

        dispatch(setAlert({ newPostError: 'Post update failed, please try again.' }));
    }

}