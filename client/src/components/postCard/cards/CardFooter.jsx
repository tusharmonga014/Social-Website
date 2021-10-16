import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import LikeButton from "../../LikeButton";
import ShareModal from "../../ShareModal";
import { BASE_URL } from "../../../utils/config";
import { likePost, unlikePost } from "../../../redux/actions/postAction";


const CardFooter = ({ post }) => {

    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const location = useLocation();


    const { pathname } = location;
    const [isShare, setIsShare] = useState(false);


    const [saved, setSaved] = useState(false);
    const [saveLoad, setSaveLoad] = useState(false);


    const handleLike = () => {
        dispatch(likePost(post, auth));
    }


    const handleUnlike = () => {
        dispatch(unlikePost(post, auth));
    }


    const handleSavePost = async () => {
        if (saveLoad) return;
        setSaveLoad(true);
        // await dispatch(savePost({ post, auth }))
        setSaveLoad(false);
    }


    const handleUnSavePost = async () => {
        if (saveLoad) return;
        setSaveLoad(true);
        // await dispatch(unSavePost({ post, auth }))
        setSaveLoad(false);
    }


    // useEffect(() => {
    // if (auth.user.saved.find(id => id === post._id)) setSaved(true);
    // else setSaved(false);
    // }, [auth.user.saved, post._id]);


    return (
        <div className="card-footer">

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
                    saved
                        ? <i className="fas fa-bookmark text-info"
                            onClick={handleUnSavePost} />

                        : <i className="far fa-bookmark"
                            onClick={handleSavePost} />
                }
            </div>

            <div className="d-flex justify-content-between">
                <h6 style={{ padding: '0 25px', cursor: 'pointer' }}>
                    {post.likes.length} likes
                </h6>
                <h6 style={{ padding: '0 25px', cursor: 'pointer' }}>
                    {post.comments.length} comments
                </h6>
            </div>

            {
                isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} />
            }

        </div>
    );
}

export default CardFooter;