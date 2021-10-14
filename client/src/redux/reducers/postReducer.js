import { POST_TYPES } from "../actions/postAction";
import { EditData } from "../actions/TYPES";

const initialState = {
    newPostModal: false,
    postUploading: false,
    postUploaded: false,
    homePosts: {
        page: 1
    }
};

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TYPES.NEW_POST_MODAL:
            return {
                ...state,
                postUploading: false,
                postUploaded: false,
                newPostModal: action.payload
            };
        case POST_TYPES.POST_UPLOADING:
            return {
                ...state,
                postUploading: action.payload
            };
        case POST_TYPES.POST_UPLOADED:
            return {
                ...state,
                postUploading: false,
                postUploaded: action.payload
            };
        case POST_TYPES.POSTS_LOADING:
            return {
                ...state,
                postsLoading: action.payload
            };
        case POST_TYPES.GET_POSTS:
            return {
                ...state,
                homePosts: action.payload
            };
        case POST_TYPES.UPDATE_POST:
            return {
                ...state,
                homePosts: { ...state.homePosts, posts: EditData(state.homePosts.posts, action.payload._id, action.payload) }
            };
        default:
            return state;
    }
}

export default postReducer;