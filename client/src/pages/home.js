import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import HomePosts from "../components/home/HomePosts";
import NewPost from "../components/home/NewPost/NewPost";

let scroll = 0;

const Home = () => {

    const { post } = useSelector(state => state);
    const { homePosts } = post;


    window.addEventListener('scroll', () => {
        if (window.location.pathname === '/') {
            scroll = window.pageYOffset;
            return scroll;
        }
    });


    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({ top: scroll, behavior: 'smooth' });
        }, 100);
    }, []);


    return (
        <div className="home row mx-0">

            <div className="col-md-8">
                <NewPost />
                {
                    (homePosts.result === 0 && homePosts.posts.length === 0)
                        ? <h2 className="text-center text-muted mt-4">Follow people to see their posts.</h2>
                        : <HomePosts />
                }
            </div>

        </div >
    );
}

export default Home;