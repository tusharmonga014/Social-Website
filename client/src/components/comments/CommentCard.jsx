import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LikeButton from "../LikeButton";
import UserImage from "../UserImage";
import InputComment from "./InputComment";
import { updateComment, likeComment, unlikeComment, deleteComment } from "../../redux/actions/commentAction";


const CommentCard = ({ children, comment, post, commentId }) => {

    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const location = useLocation();


    const [content, setContent] = useState('');
    const [readMore, setReadMore] = useState(false);


    const [onEdit, setOnEdit] = useState(false);
    const [onReply, setOnReply] = useState(false);


    const { pathname } = location;


    const handleUpdate = () => {
        if (comment.content.trim() === content || !content.trim()) return;
        dispatch(updateComment({ comment, post, content, auth }));
        setOnEdit(false);
    }


    const cancelUpdate = () => {
        setOnEdit(false);
        setContent(comment.content);
    }


    const handleLike = () => {
        dispatch(likeComment({ comment, post, auth }));
    }


    const handleUnlike = () => {
        dispatch(unlikeComment({ comment, post, auth }));
    }


    const handleReply = () => {
        if (onReply) return setOnReply(false);
        setOnReply({ ...comment, commentId });
    }


    const handleRemove = () => {
        dispatch(deleteComment({ comment, post, auth }));
    }


    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? 'inherit' : 'none'
    }


    const MenuItem = () => {
        return (
            <>
                <small className="font-weight-bold mr-2 text-muted" onClick={() => setOnEdit(true)}>Edit</small>
                <small className="font-weight-bold text-muted" onClick={handleRemove}>Remove</small>
            </>
        );
    }


    useEffect(() => {
        setContent(comment.content);
        setOnReply(false);
    }, [comment, post, auth.user._id]);


    return (
        <div className="comment-card mt-2" style={styleCard}>

            {
                pathname === `/profile/${comment.user._id}`
                    ? <span className="d-flex text-dark">
                        <UserImage src={comment.user.userImage} size="small" />
                        <small className="mx-1 ml-2 font-weight-bold">{comment.user.username}</small>
                        <small className="text-muted">
                            {moment(comment.createdAt).fromNow()}
                        </small>
                    </span>
                    : <Link to={`/profile/${comment.user._id}`} className="d-flex text-dark">
                        <UserImage src={comment.user.userImage} size="small" />
                        <small className="mx-1 ml-2 font-weight-bold">{comment.user.username}</small>
                        <small className="text-muted">
                            {moment(comment.createdAt).fromNow()}
                        </small>
                    </Link>
            }


            <div className="comment-content">

                <div className="flex-fill">
                    {
                        onEdit
                            ? <textarea rows="5" value={content} autoFocus
                                onChange={event => setContent(event.target.value)} />
                            : <div>
                                {
                                    comment.tag && comment.tag._id !== comment.user._id &&
                                    <Link to={`/profile/${comment.tag._id}`} className="mr-1">
                                        @{comment.tag.username}
                                    </Link>
                                }
                                {
                                    <small>
                                        {
                                            content.length < 70
                                                ? content
                                                : readMore
                                                    ? content + ' '
                                                    : content.slice(0, 70) + '...'
                                        }
                                    </small>
                                }
                                {
                                    content.length > 100 &&
                                    <small className="readMore" onClick={() => setReadMore(!readMore)}>
                                        {readMore && 'Read more'}
                                    </small>
                                }
                            </div>
                    }
                    <div style={{ cursor: 'pointer' }}>
                        <small className="mr-3 text-muted">
                            {comment.likes.length} likes
                        </small>
                        {
                            onEdit
                                ? <>
                                    <small className="font-weight-bold mr-2 text-muted"
                                        onClick={handleUpdate}>
                                        Update
                                    </small>
                                    <small className="font-weight-bold mr-2 text-muted"
                                        onClick={cancelUpdate}>
                                        Cancel
                                    </small>
                                </>
                                : <>
                                    <small className="font-weight-bold mr-2 text-muted"
                                        onClick={handleReply}>
                                        {onReply ? 'Cancel' : 'Reply'}
                                    </small>
                                    {
                                        !onReply ?
                                            post.user._id === auth.user._id
                                                ? comment.user._id === auth.user._id
                                                    ? MenuItem()
                                                    : <small className="font-weight-bold text-muted" onClick={handleRemove}>Remove</small>
                                                : comment.user._id === auth.user._id && MenuItem()
                                            : null
                                    }
                                </>
                        }
                    </div>
                </div>

                <div className="d-flex align-items-center mx-2" style={{ cursor: 'pointer' }}>
                    <LikeButton isLike={comment.likes.find(like => like === auth.user._id)}
                        handleLike={handleLike} handleUnlike={handleUnlike} />
                </div>

            </div>


            {
                onReply &&
                <InputComment post={post} onReply={onReply} setOnReply={setOnReply} >
                    <Link to={`/profile/${onReply.user._id}`} className="mr-1" >
                        <small>@{onReply.user.username}</small>
                    </Link>
                </InputComment>
            }


            {children}


        </div >
    );
}

export default CommentCard;