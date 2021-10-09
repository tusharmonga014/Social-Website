import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import profile from "./profileReducer";
import post from "./postReducer";

const rootReducer = combineReducers(
    {
        auth,
        alert,
        profile,
        post
    }
)

export default rootReducer;