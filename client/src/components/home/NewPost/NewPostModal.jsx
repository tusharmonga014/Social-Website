import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { POST_TYPES } from "../../../redux/actions/postAction";
import Icons from "../../Icons";
import ImageThumbnail from "../../ImageThumbnail";
import VideoThumbnail from "../../VideoThumbnail";
import { setAlert } from "../../../redux/actions/alertAction";


const NewPostModal = () => {

    const { auth, alert } = useSelector(state => state);
    const dispatch = useDispatch();


    const maxImages = 10;  // 10 images
    const maxContetLength = 500; // 500 characters
    const maxFileSize = 1024 * 1024 * 5;   // 5 mb


    const [content, setContent] = useState('');
    const [remainingContentLength, setRemainingContentLength] = useState(maxContetLength);
    const [images, setImages] = useState([]);


    const [stream, setStream] = useState(false);
    const videoRef = useRef();
    const refCanvas = useRef();
    const [tracks, setTracks] = useState('');


    const handleChangeContent = newContent => {
        const newRemainingContentLength = maxContetLength - newContent.length;
        const contentLengthElement = document.querySelector('.new-post-header .content-length');
        setRemainingContentLength(newRemainingContentLength);
        setContent(newContent);
        if (newRemainingContentLength < 0) {
            contentLengthElement.classList.remove('text-muted');
            contentLengthElement.classList.add('text-danger');
            dispatch(setAlert({ newPostError: 'Post cannot have more than 500 characters.' }));
        } else {
            contentLengthElement.classList.remove('text-danger');
            contentLengthElement.classList.add('text-muted');
            dispatch(setAlert({ newPostError: '' }));
        }
    }


    const handleChangeImages = event => {
        dispatch(setAlert({ newPostError: '' }));

        const files = [...event.target.files];
        const newImages = [];

        let err = '';
        if (images.length === 10 || images.length + files.length > maxImages)
            err = 'Cannot add more than 10 photos/videos.';
        else files.forEach(file => {
            if (!file)
                return err = "File does not exist.";
            if (file.size > maxFileSize)
                return err = `${file.name} is larger than 5mb.`;
            if (file.type !== 'image/jpeg' && file.type !== 'video/mp4' && file.type !== 'image/png')
                return err = `${file.name} is not in correct format.`;
            return newImages.push(file);
        });

        if (err) dispatch(setAlert({ newPostError: err }));
        else setImages([...images, ...newImages]);
    }


    const deleteImages = index => {
        dispatch(setAlert({ newPostError: '' }));
        const newImagesArray = [...images];
        newImagesArray.splice(index, 1);
        setImages(newImagesArray);
    }


    const handleStream = () => {
        setStream(true);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStream => {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play();
                    const track = mediaStream.getTracks();
                    setTracks(track[0]);
                })
                .catch(err => console.error(err));
        }
    }


    const handleCapture = () => {
        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;
        refCanvas.current.setAttribute("width", width);
        refCanvas.current.setAttribute("height", height);
        const ctx = refCanvas.current.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        const URL = refCanvas.current.toDataURL();
        setImages([...images, { camera: URL }]);
    }


    const handleStopStream = () => {
        tracks.stop();
        setStream(false);
    }


    const handleSubmit = event => {
        event.preventDefault();
        if (content.length === 0 && images.length === 0)
            return dispatch(setAlert({ newPostError: 'Post cannot be empty.' }));
        // if (post.onEdit) {
        // dispatch(updatePost({ content, images, auth, status }))
        // } else {
        // dispatch(createPost({ content, images, auth, socket }))
        // }
        setContent("");
        setImages([]);
        if (tracks) tracks.stop();
        closeNewPostModal();
    }


    const closeNewPostModal = () => {
        dispatch({
            type: POST_TYPES.NEW_POST_MODAL,
            payload: false
        });
        dispatch(setAlert({ newPostError: '' }));
    }


    // useEffect(() => {
    //     // if (post.onEdit) {
    //     //     setContent(post.content)
    //     //     setImages(post.images)
    //     // }
    // }, [post]);


    return (

        <div className="new-post-modal">
            <form onSubmit={handleSubmit}>


                <div className="new-post-header">
                    <div>
                        <span className="h5 m-0">Create New Post</span>
                        <small className="content-length text-muted ml-2">({remainingContentLength})</small>
                    </div>
                    <span className="close-button" onClick={closeNewPostModal}>&times;</span>
                </div>


                <div className="new-post-body">
                    <textarea name="content" value={content} spellCheck="false"
                        placeholder={`${auth.user.username}, what are you thinking?`}
                        onChange={event => handleChangeContent(event.target.value)} />
                    <div className="d-flex">
                        <div className="flex-fill"></div>
                        <Icons setContent={handleChangeContent} content={content} />
                    </div>
                    <div className="show-images">
                        {
                            images.map((img, index) => (
                                <div key={index} id="file_img">
                                    {
                                        img.camera ? <ImageThumbnail src={img.camera} alt="image" />
                                            : img.url
                                                ? <>
                                                    {
                                                        img.url.match(/video/i)
                                                            ? <VideoThumbnail src={img.url} alt="video" />
                                                            : <ImageThumbnail src={img.url} alt="image" />
                                                    }
                                                </>
                                                : <>
                                                    {
                                                        img.type.match(/video/i)
                                                            ? <VideoThumbnail src={URL.createObjectURL(img)} alt="video" />
                                                            : <ImageThumbnail src={URL.createObjectURL(img)} alt="image" />
                                                    }
                                                </>
                                    }
                                    <span onClick={() => deleteImages(index)}>&times;</span>
                                </div>
                            ))
                        }
                    </div>
                    {
                        stream &&
                        <div className="stream position-relative">
                            <video autoPlay muted ref={videoRef} width="100%" height="100%" />
                            <span onClick={handleStopStream}>&times; </span>
                            <canvas ref={refCanvas} style={{ display: "none" }} />
                        </div>
                    }
                    <div className="input-images">
                        {
                            stream
                                ? <i className="fas fa-camera" onClick={handleCapture} />
                                : <>
                                    <i className="fas fa-camera" onClick={handleStream} />
                                    <div className="file_upload">
                                        <i className="fas fa-image" />
                                        <input type="file" name="file" id="file" multiple
                                            accept="image/*,video/*" onChange={handleChangeImages} />
                                    </div>
                                </>
                        }
                    </div>
                </div>


                <div className="new-post-footer">
                    <small className="form-text text-danger mb-2">
                        {alert.newPostError ? alert.newPostError : ""}
                    </small>
                    <button className="btn btn-secondary w-100" type="submit">
                        Post
                    </button>
                </div>


            </form>
        </div>
    );
}

export default NewPostModal;