import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createComment } from "../../redux/actions/commentAction";
import Icons from "../Icons";


const InputComment = ({ children, post, onReply, setOnReply }) => {

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch();


    const [content, setContent] = useState('')


    const handleSubmit = (event) => {
        event.preventDefault();
        if (!content.trim()) {
            if (setOnReply) return setOnReply(false);
            return;
        }
        setContent('');
        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        }
        dispatch(createComment({ post, newComment, auth }));
        if (setOnReply) return setOnReply(false);
    }


    return (
        <form className="card-footer comment-input" onSubmit={handleSubmit} >

            {children}

            <input type="text" className="small" placeholder="Add your comment" autoFocus
                value={content} onChange={event => setContent(event.target.value)} />

            <Icons setContent={setContent} content={content} />

            <button type="submit" className="post-button">
                Post
            </button>

        </form>
    );
}

export default InputComment;