import { POST_TYPES } from "../actions/postAction";

const initialState = {
    newPostModal: false
};

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TYPES.NEW_POST_MODAL:
            return {
                ...state,
                newPostModal: action.payload
            };
        default:
            return state;
    }
}

export default postReducer;