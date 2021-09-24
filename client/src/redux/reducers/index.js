import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import profile from "./profileReducer";

const rootReducer = combineReducers(
    {
        auth,
        alert,
        profile
    }
)

export default rootReducer;