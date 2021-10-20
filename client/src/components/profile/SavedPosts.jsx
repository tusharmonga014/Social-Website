import React from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Posts from "../Posts";
import LoadIcon from "../../images/loading.gif";
import { getSavedPosts } from "../../redux/actions/postAction";


const SavedPosts = () => {

    const { auth, post } = useSelector(state => state);
    const dispatch = useDispatch();
    const { id } = useParams();


    const getMorePosts = () => {
        dispatch(getSavedPosts(id, auth, currentSavedPostsData().page));
    }


    const currentSavedPostsData = () => {
        return post.savedPosts;
    }


    return (
        <div className="col-md-10 mx-auto">
            {
                currentSavedPostsData()
                    ?
                    currentSavedPostsData().posts.length === 0 && currentSavedPostsData().result === 0
                        ? <h2 className="text-center text-muted mt-5">No Saved Posts</h2>
                        : <Posts posts={currentSavedPostsData().posts} getMorePosts={getMorePosts}
                            result={currentSavedPostsData().result} page={currentSavedPostsData().page} />
                    : <img className="d-block mx-auto" src={LoadIcon} alt="loading" />
            }
        </div>
    );
}

export default SavedPosts;