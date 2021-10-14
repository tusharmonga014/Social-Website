import React from "react";
import { useSelector, useDispatch } from "react-redux";
import UserImage from "../../UserImage";
import { POST_TYPES } from "../../../redux/actions/postAction";

const NewPost = () => {

    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();


    return (

        <div className="new-post my-3 d-flex">
            
            <UserImage src={auth.user.userImage} size="big" />

            <button className="new-post-btn flex-fill"
                onClick={() => dispatch({ type: POST_TYPES.NEW_POST_MODAL, payload: true })}>
                {auth.user.username}, what are you thinking?
            </button>

        </div>

    );
}

export default NewPost;