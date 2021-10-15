import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import moment from "moment";
import UserImage from "../../UserImage";
import { BASE_URL } from "../../../utils/config";
import { deletePost, POST_TYPES } from "../../../redux/actions/postAction";


const CardHeader = ({ post }) => {

    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();


    const handleEditPost = () => {
        dispatch({ type: POST_TYPES.ON_EDIT, payload: { ...post } });
    }


    const handleDeletePost = () => {
        if (window.confirm("Are you sure want to delete this post?")) {
            dispatch(deletePost(post, auth));
            return history.push("/");
        }
    }


    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`);
    }


    return (
        <div className="card-header">

            <div className="d-flex">

                <UserImage src={post.user.userImage} size="big" />

                <div className="ml-3 card-name">
                    <h6 className="m-0">
                        <Link to={`/profile/${post.user._id}`} className="text-dark">
                            {post.user.username}
                        </Link>
                    </h6>
                    <small className="text-muted">
                        {moment(post.createdAt).fromNow()}
                    </small>
                </div>

            </div>


            <div className="nav-item dropdown">

                <span className="material-icons" id="moreLink" data-toggle="dropdown">
                    more_horiz
                </span>

                <div className="dropdown-menu">
                    {
                        auth.user._id === post.user._id &&
                        <>
                            <div className="dropdown-item" onClick={handleEditPost}>
                                <span className="material-icons">create</span> Edit Post
                            </div>
                            <div className="dropdown-item" onClick={handleDeletePost} >
                                <span className="material-icons">delete_outline</span> Remove Post
                            </div>
                        </>
                    }
                    <div className="dropdown-item" onClick={handleCopyLink}>
                        <span className="material-icons">content_copy</span> Copy Link
                    </div>
                </div>

            </div>

        </div>
    );
}

export default CardHeader;