import React, { useState } from "react";
import Carousel from "../../Carousel";


const CardBody = ({ post }) => {

    const [readMore, setReadMore] = useState(false);


    return (
        <div className="card-body m-0">

            <div className="card-body-content ml-5 text-dark lead" style={{ fontWeight: '400', margin: post.content ? '7px 0' : '0' }}>
                <span>
                    {
                        post.content.length < 60
                            ? post.content
                            : readMore
                                ? post.content + ' '
                                : post.content.slice(0, 60) + '.....'
                    }
                </span>
                {
                    post.content.length > 60 &&
                    <span className="readMore" onClick={() => setReadMore(!readMore)}>
                        {readMore ? 'Hide content' : 'Read more'}
                    </span>
                }
            </div>

            {
                post.media.length > 0 && <Carousel media={post.media} id={post._id} />
            }

        </div>
    );
}

export default CardBody;