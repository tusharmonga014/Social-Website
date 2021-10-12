import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import profile from "./profileReducer";
import post from "./postReducer";
import suggestions from "./suggestionsReducer";

const rootReducer = combineReducers(
    {
        auth,
        alert,
        profile,
        post,
        suggestions
    }
)

export default rootReducer;