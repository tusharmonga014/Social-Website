import React from "react";


const LikeButton = ({ isLike, handleLike, handleUnlike }) => {

    return (
        <>
            {
                isLike
                    ? <i className="fas fa-thumbs-up text-primary" onClick={handleUnlike} />
                    : <i className="far fa-thumbs-up text-dark" onClick={handleLike} />
            }
        </>
    );
}

export default LikeButton;