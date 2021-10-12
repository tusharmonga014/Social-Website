import React from "react";
import CardHeader from "./Cards/CardHeader";
import CardBody from "./Cards/CardBody";
import CardFooter from "./Cards/CardFooter";


const PostCard = ({ post }) => {

    return (
        <div className="card my-3">

            <CardHeader post={post} />
            <CardBody post={post} />
            <CardFooter post={post} />

            {/* <Comments post={post} /> */}
            {/* <InputComment post={post} /> */}

        </div>
    );
}

export default PostCard;