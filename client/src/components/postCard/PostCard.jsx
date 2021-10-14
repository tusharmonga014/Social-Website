import React from "react";
import CardHeader from "./cards/CardHeader";
import CardBody from "./cards/CardBody";
import CardFooter from "./cards/CardFooter";
import Comments from "../comments/Comments";
import InputComment from "../comments/InputComment";


const PostCard = ({ post }) => {

    return (
        <div className="card my-3">

            <CardHeader post={post} />
            <CardBody post={post} />
            <CardFooter post={post} />

            <Comments post={post} />
            <InputComment post={post} />

        </div>
    );
}

export default PostCard;