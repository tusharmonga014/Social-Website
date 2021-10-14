import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import LikeButton from "../LikeButton";
import UserImage from "../UserImage";
import InputComment from "./InputComment";
import CommentMenu from "./CommentMenu";
// import { updateComment, likeComment, unLikeComment } from "../../../redux/actions/commentAction";


const CommentCard = ({ children, comment, post, commentId }) => {

    const { auth } = useSelector(state => state);


    const [content, setContent] = useState('');
    const [readMore, setReadMore] = useState(false);


    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false);


    const [onEdit, setOnEdit] = useState(false);
    const [onReply, setOnReply] = useState(false);


    const handleUpdate = () => {
        // if (comment.content !== content)
        // dispatch(updateComment({ comment, post, content, auth }));
        setOnEdit(false);
    }


    const handleLike = async () => {
        if (loadLike) return;
        setIsLike(true);
        setLoadLike(true);
        // await dispatch(likeComment({ comment, post, auth }));
        setLoadLike(false);
    }


    const handleUnLike = async () => {
        if (loadLike) return;
        setIsLike(false);
        setLoadLike(true);
        // await dispatch(unLikeComment({ comment, post, auth }));
        setLoadLike(false);
    }


    const handleReply = () => {
        if (onReply) return setOnReply(false);
        setOnReply({ ...comment, commentId });
    }


    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? 'inherit' : 'none'
    }


    useEffect(() => {
        setContent(comment.content);
        setIsLike(false);
        setOnReply(false);
        if (comment.likes.find(like => like._id === auth.user._id)) setIsLike(true);
    }, [comment, auth.user._id]);


    return (
        <div className="comment-card mt-2" style={styleCard}>


            <Link to={`/profile/${comment.user._id}`} className="d-flex text-dark">
                <UserImage src={comment.user.userImage} size="small" />
                <small className="mx-1 ml-2 font-weight-bold">{comment.user.username}</small>
            </Link>


            <div className="comment-content">

                <div className="flex-fill">
                    {
                        onEdit
                            ? <textarea rows="5" value={content}
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
                        <small className="text-muted mr-3">
                            {moment(comment.createdAt).fromNow()}
                        </small>
                        <small className="mr-3 text-muted">
                            {comment.likes.length} likes
                        </small>
                        {
                            onEdit
                                ? <>
                                    <small className="font-weight-bold mr-3 text-muted"
                                        onClick={handleUpdate}>
                                        Edit
                                    </small>
                                    <small className="font-weight-bold mr-3 text-muted"
                                        onClick={() => setOnEdit(false)}>
                                        Cancel
                                    </small>
                                </>
                                : <small className="font-weight-bold mr-3 text-muted"
                                    onClick={handleReply}>
                                    {onReply ? 'Cancel' : 'Reply'}
                                </small>
                        }
                    </div>
                </div>

                <div className="d-flex align-items-center mx-2" style={{ cursor: 'pointer' }}>
                    <CommentMenu post={post} comment={comment} setOnEdit={setOnEdit} />
                    <LikeButton isLike={isLike} handleLike={handleLike} handleUnLike={handleUnLike} />
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