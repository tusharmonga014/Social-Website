import React from "react";
import { Link } from "react-router-dom";
import getCostumoizedUrl from "../utils/convertImageUrlForQuality";


const PostThumbnail = ({ media }) => {

    return (
        <div className="post-thumb">
            {
                media.map(mediaFile => (
                    <Link key={mediaFile.public_id} to={`/post/${mediaFile.postId}`}>

                        <div className="post-thumb-display">
                            {
                                mediaFile.url.match(/video/i)
                                    ? <video controls src={getCostumoizedUrl(mediaFile.url, 'w_400', true)} alt={mediaFile.url} />
                                    : <img src={getCostumoizedUrl(mediaFile.url, 'w_500', true)} alt={mediaFile.url} />
                            }
                        </div>

                    </Link>
                ))
            }
        </div>
    );
}

export default PostThumbnail;