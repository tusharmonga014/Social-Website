import React from "react";
import { Link } from "react-router-dom";


const PostThumbnail = ({ mediaPosts, result }) => {

    if (result === 0) return <h2 className="text-center text-muted">No Photos</h2>

    return (
        <div className="post-thumb">
            {
                mediaPosts.map(mediaFiles => (
                    <Link key={mediaFiles.public_id} to={`/post/${mediaFiles.postId}`}>

                        <div className="post-thumb-display">
                            {
                                mediaFiles.media[0].url.match(/video/i)
                                    ? <video controls src={mediaFiles.media[0].url} alt={mediaFiles.media[0].url} />
                                    : <img src={mediaFiles.media[0].url} alt={mediaFiles.media[0].url} />
                            }
                            <div className="post-thumb-menu">
                                <i className="far fa-thumbs-up">{mediaFiles.likes.length}</i>
                                <i className="far fa-comment">{mediaFiles.comments.length}</i>
                            </div>
                        </div>

                    </Link>
                ))
            }
        </div>
    );
}

export default PostThumbnail;