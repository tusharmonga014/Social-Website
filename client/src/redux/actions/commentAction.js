import { patchDataAPI, postDataAPI } from "../../utils/fetchData";
import { setAlert } from "./alertAction";
import { POST_TYPES } from "./postAction";
import { EditData } from "./TYPES";


export const createComment = ({ post, newComment, auth }) => async (dispatch) => {

    const newPost = { ...post, comments: [...post.comments, newComment] }
    dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: newPost
    });


    try {

        const newCommentData = { ...newComment, postId: post._id, postUserId: post.user._id }
        const res = await postDataAPI('comments/create-comment', newCommentData, auth.token);


        const responseCommentData = { ...res.data.comment, user: auth.user };
        const newPost = { ...post, comments: [...post.comments, responseCommentData] };


        dispatch({
            type: POST_TYPES.UPDATE_POST,
            payload: newPost
        });


        // // Socket
        // socket.emit('createComment', newPost);


        // // Notify
        // const msg = {
        //     id: res.data.newComment._id,
        //     text: newComment.reply ? 'mentioned you in a comment.' : 'has commented on your post.',
        //     recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
        //     url: `/post/${post._id}`,
        //     content: post.content,
        //     image: post.images[0].url
        // }


        // dispatch(createNotify({ msg, auth, socket }));


    } catch (err) {

        dispatch(setAlert({ newCommentError: err.response.data.msg }));
    }

}


export const updateComment = ({ comment, post, content, auth }) => async (dispatch) => {

    try {

        await patchDataAPI(`comments/${comment._id}/update-comment`, { content }, auth.token);


        const commentsArrayWithUpdatedComment = EditData(post.comments, comment._id, { ...comment, content });
        const updatedPost = { ...post, comments: commentsArrayWithUpdatedComment };


        dispatch({
            type: POST_TYPES.UPDATE_POST,
            payload: updatedPost
        });


    } catch (err) {

        dispatch(setAlert({ updateCommentError: err.response.data.msg }));
    }

}