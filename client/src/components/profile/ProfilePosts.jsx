import React from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Posts from "../Posts";
import LoadIcon from "../../images/loading.gif";
import { getUserPosts } from "../../redux/actions/postAction";


const ProfilePosts = () => {

    const { auth, post } = useSelector(state => state);
    const dispatch = useDispatch();
    const { id } = useParams();


    const getMorePosts = () => {
        dispatch(getUserPosts(id, auth, currentUserPostsData().page));
    }


    const currentUserPostsData = () => {
        return post.profilePostsArray.find(profilePosts => profilePosts._id === id);
    }


    return (
        <div className="col-md-10 mx-auto p-0">
            {
                currentUserPostsData()
                    ?
                    currentUserPostsData().posts.length === 0 && currentUserPostsData().result === 0
                        ? <h2 className="text-center text-muted mt-5">No Posts</h2>
                        : <Posts posts={currentUserPostsData().posts} getMorePosts={getMorePosts}
                            result={currentUserPostsData().result} page={currentUserPostsData().page} />
                    : <img className="d-block mx-auto" src={LoadIcon} alt="loading" />
            }
        </div>
    );
}

export default ProfilePosts;