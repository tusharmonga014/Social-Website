import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../redux/actions/postAction";
import Posts from "../Posts";


const HomePosts = () => {

    const { auth, post } = useSelector(state => state);
    const dispatch = useDispatch();
    const { homePosts } = post;


    const getMorePosts = () => {
        dispatch(getPosts(auth, homePosts.page));
    }


    return (
        <Posts posts={homePosts.posts} getMorePosts={getMorePosts} result={homePosts.result} page={homePosts.page} />
    );
}

export default HomePosts;