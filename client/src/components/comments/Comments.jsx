import React, { useState, useEffect } from "react";
import CommentDisplay from "./CommentDisplay";


const Comments = ({ post }) => {

    /** This contains all the comments and reply comments. */
    const [comments, setComments] = useState([]);
    /** This contains the comments which will be shown depending on clicking of show more comments button. */
    const [showComments, setShowComments] = useState([]);
    /** This contains reply comments. */
    const [replyComments, setReplyComments] = useState([]);
    /** This sets the value telling how many more comments will be shown. */
    const [next, setNext] = useState(2);


    useEffect(() => {
        const newComments = post.comments.filter(comment => !comment.reply);
        setComments(newComments);
        setShowComments(newComments.slice(newComments.length - next));
    }, [post.comments, next]);


    useEffect(() => {
        const newReplyComments = post.comments.filter(comment => comment.reply);
        setReplyComments(newReplyComments);
    }, [post.comments]);


    return (
        <div className="comments">

            {
                showComments.map((comment, index) => (
                    // Sending comment and its reply comments
                    <CommentDisplay key={index} comment={comment} post={post}
                        replyComments={replyComments.filter(replyComment => replyComment.reply === comment._id)} />
                ))
            }

            {
                comments.length - next > 0
                    ? <small className="p-2 border-top text-primary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setNext(next + 10)}>
                        Show More...
                    </small>
                    : comments.length > 2 &&
                    <small className="p-2 border-top text-primary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setNext(2)}>
                        Show less
                    </small>
            }

        </div>
    );
}

export default Comments;