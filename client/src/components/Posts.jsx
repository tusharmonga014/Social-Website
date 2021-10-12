import React from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadIcon from "../images/loading.gif";
import PostCard from "./PostCard/PostCard";
import LoadMoreBtn from "./LoadMoreBtn";


const Posts = ({ posts, getMorePosts, result, page }) => {

    const { post } = useSelector(state => state);
    const dispatch = useDispatch();


    const handleLoadMore = async () => {
        await dispatch(getMorePosts);
    }


    return (
        <div className="posts">

            {
                posts && posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))
            }

            {
                post.postsLoading && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }

            <LoadMoreBtn result={result} page={page}
                load={post.postsLoading} handleLoadMore={handleLoadMore} />

        </div>
    );
}

export default Posts;
