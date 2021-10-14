import React from "react";
import { useSelector } from "react-redux";
// import { deleteComment } from "../../../redux/actions/commentAction";


const CommentMenu = ({ post, comment, setOnEdit }) => {

    const { auth } = useSelector(state => state);


    const handleRemove = () => {
        // if (post.user._id === auth.user._id || comment.user._id === auth.user._id) {
        // dispatch(deleteComment({post, auth, comment}));
        // }
    }


    const MenuItem = () => {
        return (
            <>
                <div className="dropdown-item" onClick={() => setOnEdit(true)}>
                    <small className="material-icons">create</small> Edit
                </div>
                <div className="dropdown-item" onClick={handleRemove}>
                    <small className="material-icons">delete_outline</small> Remove
                </div>
            </>
        )
    }


    return (
        <div className="menu">

            {
                (post.user._id === auth.user._id || comment.user._id === auth.user._id) &&
                <div className="nav-item dropdown">

                    <small className="material-icons" id="moreLink" data-toggle="dropdown">
                        more_vert
                    </small>

                    <div className="dropdown-menu" aria-labelledby="moreLink">
                        {
                            post.user._id === auth.user._id
                                ? comment.user._id === auth.user._id
                                    ? MenuItem()
                                    : <div className="dropdown-item" onClick={handleRemove}>
                                        <small className="material-icons">delete_outline</small> Remove
                                    </div>
                                : comment.user._id === auth.user._id && MenuItem()
                        }
                    </div>

                </div>
            }

        </div>
    );
}

export default CommentMenu;