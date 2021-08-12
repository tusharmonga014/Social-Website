import React from "react";


const UserImage = ({ src, size }) => {

    const sizeClass = size + "-userimage";

    return (
        <img src={src} className={sizeClass} alt="img" />
    );
}

export default UserImage;