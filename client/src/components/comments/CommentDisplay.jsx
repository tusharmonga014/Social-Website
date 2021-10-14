import React, { useState, useEffect } from "react";
import CommentCard from "./CommentCard";


const CommentDisplay = ({ comment, post, replyComments }) => {

    const [showReplyComments, setShowReplyComments] = useState([]);
    const [next, setNext] = useState(1);


    useEffect(() => {
        setShowReplyComments(replyComments.slice(replyComments.length - next))
    }, [replyComments, next]);


    return (
        <div className="comment-display">

            <CommentCard comment={comment} post={post} commentId={comment._id} >

                <div className="pl-5">
                    {
                        showReplyComments.map((replyComment, index) => (
                            // replyComment.reply &&
                            <CommentCard
                                key={index}
                                comment={replyComment}
                                post={post}
                                commentId={replyComment._id}
                            />
                        ))
                    }
                    {
                        replyComments.length - next > 0
                            ? <small className="text-primary"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setNext(next + 10)}>
                                Show more...
                            </small>
                            : replyComments.length > 1 &&
                            <small className="text-primary"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setNext(1)}>
                                Show less
                            </small>
                    }
                </div>

            </CommentCard>

        </div>
    );
}

export default CommentDisplay;