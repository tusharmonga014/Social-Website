import { POST_TYPES } from "../actions/postAction";

const initialState = {
    newPostModal: false,
    postUploading: false,
    postUploaded: false
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
        default:
            return state;
    }
}

export default postReducer;