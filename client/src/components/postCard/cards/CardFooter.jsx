import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import LikeButton from "../../LikeButton";
import ShareModal from "../../ShareModal";
import { BASE_URL } from "../../../utils/config";
import { likePost, savePost, unlikePost, unsavePost } from "../../../redux/actions/postAction";


const CardFooter = ({ post }) => {

    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const location = useLocation();


    const { pathname } = location;
    const [isShare, setIsShare] = useState(false);


    const handleLike = () => {
        dispatch(likePost(post, auth));
    }


    const handleUnlike = () => {
        dispatch(unlikePost(post, auth));
    }


    const handleSavePost = () => {
        dispatch(savePost(post, auth));
    }


    const handleUnsavePost = () => {
        dispatch(unsavePost(post, auth));
    }


    return (
        <div className="card-footer p-0">

            <div className="card-icon-menu">
                <div>
                    <LikeButton
                        isLike={post.likes.find(like => like === auth.user._id)}
                        handleLike={handleLike}
                        handleUnlike={handleUnlike}
                    />
                    {
                        pathname === `/post/${post._id}`
                            ? <i className="far fa-comment text-dark" />
                            : <Link to={`/post/${post._id}`} className="text-dark">
                                <i className="far fa-comment" />
                            </Link>
                    }
                    <i className="fas fa-paper-plane" onClick={() => setIsShare(!isShare)}></i>
                </div>
                {
                    auth.user.saved.find(id => id === post._id)
                        ? <i className="fas fa-bookmark text-dark mr-2"
                            onClick={handleUnsavePost} />

                        : <i className="far fa-bookmark mr-2"
                            onClick={handleSavePost} />
                }
            </div>

            <div className="d-flex post-likes-comments text-muted ml-1 mx-2 mb-1">
                <span style={{ padding: '0 4px' }} className="mr-2">
                    {post.likes.length} likes
                </span>
                <span>
                    {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                </span>
            </div>

            {
                isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} />
            }

        </div>
    );
}

export default CardFooter;