import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import LoadIcon from "../../images/loading.gif";
import PostCard from "../../components/postCard/PostCard";
import { getPost } from "../../redux/actions/postAction";


const Post = () => {

    const { id } = useParams();


    const { auth, post } = useSelector(state => state);
    const { detailedPosts } = post;
    const dispatch = useDispatch();


    useEffect(() => {
        if (!detailedPosts.find(post => post._id === id))
            dispatch(getPost(id, auth));
    }, [detailedPosts, dispatch, id, auth]);


    return (
        <div className="posts">
            {
                detailedPosts.find(post => post._id === id)
                    ? <PostCard post={detailedPosts.find(post => post._id === id)} />
                    : <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
            }
        </div>
    );
}

export default Post;