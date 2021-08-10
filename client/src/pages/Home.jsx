import React from "react";
import { useSelector } from "react-redux";

const Home = () => {

    const { auth } = useSelector(state => state);
    const { fullName, userImage } = auth.user;


    return (
        <div>
            <h1>Home</h1>
            {/* <h3>Hi, {fullName}</h3> */}
            {/* <img src={userImage} alt={fullName} /> */}
        </div>
    )
}

export default Home;