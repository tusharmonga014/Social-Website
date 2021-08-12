import React from "react";
import { Link } from "react-router-dom";
import UserImage from "./UserImage";

const UserCard = ({ user, border, handleClose }) => {


    const handleCloseAll = () => {
        if (handleClose) handleClose();
    }


    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>

            <div>
                <Link to={`/profile/${user._id}`} onClick={handleCloseAll}
                    className="d-flex align-items-center">

                    <UserImage src={user.userImage} size="big" />

                    <div className="ml-3" style={{ transform: 'translateY(-2px)' }}>
                        <span className="d-block">{user.username}</span>

                        <small style={{ opacity: 0.7 }}>
                            {user.fullName}
                        </small>
                    </div>

                </Link>
            </div>

        </div>
    )
}

export default UserCard