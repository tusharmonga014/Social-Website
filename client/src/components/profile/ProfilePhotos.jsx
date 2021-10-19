import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import PostThumbnail from "../PostThumbnail";
import LoadIcon from "../../images/loading.gif";
import LoadMoreBtn from "../LoadMoreBtn";
import { getUserMedia } from "../../redux/actions/postAction";


const ProfilePhotos = () => {

    const { auth, post } = useSelector(state => state);
    const dispatch = useDispatch();
    const { id } = useParams();

    const { userMedia } = post;


    const handleLoadMore = async () => {
        dispatch(getUserMedia(id, auth, currentUserMedia().page));
    }


    const currentUserMedia = () => {
        return userMedia.find(user => user._id === id);
    }


    return (
        <div>
            {
                currentUserMedia()
                    ?
                    currentUserMedia().media.length === 0 && currentUserMedia().result === 0
                        ? <h2 className="text-center text-muted mt-5">No Photos</h2>
                        : <>
                            <PostThumbnail media={currentUserMedia().media} />
                            <LoadMoreBtn result={currentUserMedia().result} page={currentUserMedia().page}
                                load={false} handleLoadMore={handleLoadMore} />
                        </>
                    : <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }
        </div>
    );
}

export default ProfilePhotos;