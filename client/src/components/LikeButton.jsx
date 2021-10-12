import React from "react";


const LikeButton = ({ isLike, handleLike, handleUnLike }) => {

    return (
        <>
            {
                isLike
                    ? <i className="fas fa-thumbs-up text-primary" onClick={handleUnLike} />
                    : <i className="far fa-thumbs-up text-dark" onClick={handleLike} />
            }
        </>
    );
}

export default LikeButton;