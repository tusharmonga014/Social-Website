import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from "../../utils/fetchData";
import { DeleteData, TYPES } from "./TYPES";
import { setAlert } from "./alertAction";

export const POST_TYPES = {

    NEW_POST_MODAL: 'NEW_POST_MODAL',
    POST_UPLOADING: 'POST_UPLOADING',
    POST_UPLOADED: 'POST_UPLOADED',
    POSTS_LOADING: 'POSTS_LOADING',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    ON_EDIT: 'ON_EDIT',
    REMOVE_POST: 'REMOVE_POST',
    GET_POST: 'GET_POST',
    GET_USER_POSTS: 'GET_USER_POSTS',
    GET_USER_MEDIA: 'GET_USER_MEDIA',
    GET_SAVED_POSTS: 'GET_SAVED_POSTS'

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


        const res = await postDataAPI('posts/create-post', formData, auth.token);
        const { newPost } = res.data;


        newPost.user = {
            _id: auth.user._id,
            username: auth.user.username,
            userImage: auth.user.userImage
        };
        const newPostReversedMedia = newPost.media.map((mediaFile, index, media) => {
            const newMediaFile = { ...media[media.length - 1 - index], postId: newPost._id };
            return newMediaFile;
        });


        dispatch({
            type: POST_TYPES.POST_UPLOADED,
            payload: true
        });


        dispatch({
            type: POST_TYPES.POST_UPLOADING,
            payload: false
        });


        dispatch({
            type: POST_TYPES.GET_USER_POSTS,
            payload: { post: newPost, _id: auth.user._id, userAddedNewPost: true }
        });


        dispatch({
            type: POST_TYPES.GET_USER_MEDIA,
            payload: { media: newPostReversedMedia, _id: auth.user._id, userAddedNewPost: true }
        });


        dispatch(getPosts(auth, 1, 9, true));


    } catch (err) {

        dispatch({
            type: POST_TYPES.POST_UPLOADED,
            payload: false
        });


        dispatch(setAlert({ newPostError: 'Post update failed, please try again.' }));
    }

}


export const getPosts = (auth, homePostsPage, limit, refreshHome) => async (dispatch) => {

    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: true
    });


    try {

        limit = limit * 1 || 9;
        homePostsPage = homePostsPage * 1 || 1;

        const url = `posts/feed-posts?limit=${limit}&page=${homePostsPage}`;
        const res = await getDataAPI(url, auth.token);

        const { posts, result } = res.data;
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: { posts, result, page: homePostsPage + 1, refreshHome }
        });


    } catch (err) {

        dispatch(setAlert({ postsError: 'Post update failed, please try again.' }));
    }


    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: false
    });

}


export const updatePost = (content, media, auth, post) => async (dispatch) => {

    dispatch({
        type: POST_TYPES.POST_UPLOADING,
        payload: true
    });


    try {

        const postId = post._id;
        await patchDataAPI(`posts/${postId}/update-post`, { content, media }, auth.token);


        dispatch({
            type: POST_TYPES.UPDATE_POST,
            payload: { ...post, content: content, media: media }
        });


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


export const deletePost = (post, auth) => async (dispatch) => {

    try {

        const postId = post._id;
        await deleteDataAPI(`posts/${postId}/delete-post`, auth.token);


        dispatch({
            type: POST_TYPES.REMOVE_POST,
            payload: post
        });


    } catch (err) {

        dispatch(setAlert({ deletePostError: err.response.data.msg }));
    }

}


export const likePost = (post, auth) => async (dispatch) => {

    const updatedPost = { ...post, likes: [...post.likes, auth.user._id] };


    dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: updatedPost
    });


    try {

        const postId = post._id;
        await patchDataAPI(`posts/${postId}/like-post`, null, auth.token);


    } catch (err) {

        const updatedPost = { ...post, likes: DeleteData(post.likes, auth.user._id) };


        dispatch({
            type: POST_TYPES.UPDATE_POST,
            payload: updatedPost
        });


        dispatch(setAlert({ likePostError: err.response.data.msg }));
    }

}


export const unlikePost = (post, auth) => async (dispatch) => {

    const updatedPost = { ...post, likes: DeleteData(post.likes, auth.user._id) };


    dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: updatedPost
    });


    try {

        const postId = post._id;
        await patchDataAPI(`posts/${postId}/unlike-post`, null, auth.token);


    } catch (err) {

        const updatedPost = { ...post, likes: [...post.likes, auth.user._id] };


        dispatch({
            type: POST_TYPES.UPDATE_POST,
            payload: updatedPost
        });


        dispatch(setAlert({ unlikePostError: err.response.data.msg }));
    }

}


export const getPost = (id, auth) => async (dispatch) => {

    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: true
    });


    try {

        const res = await getDataAPI(`posts/${id}/get-post`, auth.token);
        const recievedPost = res.data.post;


        dispatch({
            type: POST_TYPES.GET_POST,
            payload: recievedPost
        });


    } catch (err) {

        dispatch(setAlert({ getPostError: err.response }));
    }


    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: false
    });

}


export const getUserPosts = (id, auth, page, limit) => async (dispatch) => {

    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: true
    });


    try {

        limit = limit * 1 || 9;

        const url = `posts/${id}/get-user-posts?limit=${limit}&page=${page}`;
        const res = await getDataAPI(url, auth.token);
        const postsData = res.data;


        dispatch({
            type: POST_TYPES.GET_USER_POSTS,
            payload: { posts: postsData.posts, _id: id, result: postsData.result, page: page + 1 }
        });


    } catch (err) {

        dispatch(setAlert({ getUserPostsError: err.response.data.msg }));
    }


    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: false
    });

}


export const getUserMedia = (id, auth, page, limit) => async (dispatch) => {

    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: true
    });


    try {

        limit = limit * 1 || 9;

        const url = `posts/${id}/get-user-media?limit=${limit}&page=${page}`;
        const res = await getDataAPI(url, auth.token);
        const { media, result } = res.data;


        dispatch({
            type: POST_TYPES.GET_USER_MEDIA,
            payload: { media, _id: id, result, page: page + 1 }
        });


    } catch (err) {

        dispatch(setAlert({ getUserMediaError: err.response.data.msg }));
    }


    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: false
    });

}


export const savePost = (post, auth) => async (dispatch) => {

    const postId = post._id;
    const updatedUser = { ...auth.user, saved: [postId, ...auth.user.saved] };


    dispatch({
        type: TYPES.AUTH,
        payload: { ...auth, user: updatedUser }
    });


    try {

        await patchDataAPI(`posts/${postId}/save-post`, null, auth.token);

    } catch (err) {

        const updatedUser = { ...auth.user, saved: DeleteData(auth.user.saved, postId) };
        dispatch({
            type: TYPES.AUTH,
            payload: { ...auth, user: updatedUser }
        });


        dispatch(setAlert({ savePostError: err.response.data.msg }));
    }

}


export const unsavePost = (post, auth) => async (dispatch) => {

    const postId = post._id;
    const updatedUser = { ...auth.user, saved: DeleteData(auth.user.saved, postId) };


    dispatch({
        type: TYPES.AUTH,
        payload: { ...auth, user: updatedUser }
    });


    try {

        await patchDataAPI(`posts/${postId}/unsave-post`, null, auth.token);

    } catch (err) {

        const updatedUser = { ...auth.user, saved: [postId, ...auth.user.saved] };
        dispatch({
            type: TYPES.AUTH,
            payload: { ...auth, user: updatedUser }
        });


        dispatch(setAlert({ unsavePostError: err.response.data.msg }));
    }

}


export const getSavedPosts = (id, auth, page, limit) => async (dispatch) => {

    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: true
    });


    try {

        limit = limit * 1 || 9;
        page = page * 1 || 1;

        const url = `posts/get-saved-posts?limit=${limit}&page=${page}`;
        const res = await getDataAPI(url, auth.token);
        const { posts, result } = res.data;


        dispatch({
            type: POST_TYPES.GET_SAVED_POSTS,
            payload: { posts, result, page: page + 1 }
        });


    } catch (err) {

        dispatch(setAlert({ getSavedPostsError: err.response.data.msg }));
    }


    dispatch({
        type: POST_TYPES.POSTS_LOADING,
        payload: false
    });

}