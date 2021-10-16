import { POST_TYPES } from "../actions/postAction";
import { DeleteDataById, EditData, updateDataIfElementPresent } from "../actions/TYPES";

const initialState = {
    newPostModal: false,
    postUploading: false,
    postUploaded: false,
    homePosts: {
        page: 1
    },
    detailedPosts: []
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
                homePosts: { ...state.homePosts, posts: EditData(state.homePosts.posts, action.payload._id, action.payload) },
                detailedPosts: updateDataIfElementPresent(state.detailedPosts, action.payload._id, action.payload)
            };
        case POST_TYPES.ON_EDIT:
            return {
                ...state,
                onEdit: action.payload
            };
        case POST_TYPES.REMOVE_POST:
            return {
                ...state,
                homePosts: { ...state.homePosts, posts: DeleteDataById(state.homePosts.posts, action.payload._id) },
                detailedPosts: DeleteDataById(state.detailedPosts, action.payload._id)
            };
        case POST_TYPES.GET_POST:
            return {
                ...state,
                detailedPosts: [...state.detailedPosts, action.payload]
            };
        default:
            return state;
    }
}

export default postReducer;