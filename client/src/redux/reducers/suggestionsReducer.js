import { SUGGESTIONS_TYPES } from "../actions/suggestionsAction";

const initialState = {};

const suggestionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUGGESTIONS_TYPES.SUGGESTIONS_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case SUGGESTIONS_TYPES.GET_SUGGESTIONS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

export default suggestionsReducer;