import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createPost, POST_TYPES } from "../../../redux/actions/postAction";
import Icons from "../../Icons";
import ImageThumbnail from "../../ImageThumbnail";
import VideoThumbnail from "../../VideoThumbnail";
import { setAlert } from "../../../redux/actions/alertAction";
import dataURLtoFile from "../../../utils/fileConverterUtility/base64toFile";


const NewPostModal = () => {

    const { auth, alert, post } = useSelector(state => state);
    const dispatch = useDispatch();


    const maxMedia = 10;  // 10 media files
    const maxContentLength = 500; // 500 characters
    const maxFileSize = 1024 * 1024 * 5;   // 5 mb


    const [content, setContent] = useState('');
    const [remainingContentLength, setRemainingContentLength] = useState(maxContentLength);
    const [media, setMedia] = useState([]);


    const [stream, setStream] = useState(false);
    const videoRef = useRef();
    const refCanvas = useRef();
    const [tracks, setTracks] = useState('');


    const handleChangeContent = newContent => {
        const newRemainingContentLength = maxContentLength - newContent.length;
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


    const checkMediaLength = (addedLength) => {
        if (media.length + addedLength > maxMedia)
            return false;
        return true;
    }


    const validateMediaFiles = (files) => {
        let err;
        if (!checkMediaLength(files.length))
            return 'Cannot add more than 10 photos/video.';
        files.forEach(file => {
            if (!file)
                return err = "File does not exist.";
            if (file.size > maxFileSize)
                return err = `${file.name} is larger than 5mb.`;
            if (file.type !== 'image/jpeg' && file.type !== 'video/mp4' && file.type !== 'image/png')
                return err = `${file.name} is not in correct format.`;
        });
        return err;
    }


    const handleChangeImages = event => {
        dispatch(setAlert({ newPostError: '' }));
        const files = [...event.target.files];
        const err = validateMediaFiles(files);
        if (err) dispatch(setAlert({ newPostError: err }));
        else setMedia([...media, ...files]);
    }


    const deleteMedia = index => {
        dispatch(setAlert({ newPostError: '' }));
        const newMediaArray = [...media];
        newMediaArray.splice(index, 1);
        setMedia(newMediaArray);
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
        dispatch(setAlert({ newPostError: '' }));

        if (!checkMediaLength(1)) {
            dispatch(setAlert({ newPostError: 'Cannot add more than 10 photos/videos.' }));
            return;
        }

        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;

        refCanvas.current.setAttribute("width", width);
        refCanvas.current.setAttribute("height", height);

        const ctx = refCanvas.current.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, width, height);

        const URL = refCanvas.current.toDataURL();
        const newImageFile = dataURLtoFile(URL, 'captured_image');

        setMedia([...media, newImageFile]);
    }


    const handleStopStream = () => {
        tracks.stop();
        setStream(false);
    }


    const handleSubmit = event => {
        event.preventDefault();
        dispatch(setAlert({ newPostError: '' }));
        if (!content && !media.length)
            return dispatch(setAlert({ newPostError: 'Post cannot be empty.' }));
        // if (post.onEdit) {
        // dispatch(updatePost({ content, media, auth, status }))
        // } else {
        dispatch(createPost(content, media, auth));
        // dispatch(createPost({ content, media, auth, socket }))
        // }
        if (tracks) tracks.stop();
    }


    const closeNewPostModal = () => {
        dispatch({
            type: POST_TYPES.NEW_POST_MODAL,
            payload: false
        });
        dispatch(setAlert({ newPostError: '' }));
    }



    useEffect(() => {

        const postUploadButton = document.getElementsByClassName('post-button')[0];
        if (postUploadButton) {
            const disablePostButton = () => {
                if (!content && !media.length) return true;
                if (content.length > maxContentLength) return true;
                if (!content.replace(/\s/g, "").length && !media.length) return true;
                return false;
            }
            if (disablePostButton()) postUploadButton.setAttribute('disabled', true);
            else postUploadButton.removeAttribute('disabled');
        }

    }, [content, media]);


    useEffect(() => {

        const textArea = document.querySelector('.new-post-body textarea');
        const textAreaEmojiIcon = document.querySelector('.new-post-body .emoji-icons');
        const mediaFilesCloseButton = document.querySelectorAll('.new-post-body .show-images span');
        const cameraUploadButton = document.querySelector('.new-post-body .input-images i');
        const fileUploadButton = document.querySelector('.new-post-body .input-images .file-upload');

        if (post.postUploaded || post.postUploading) {
            textArea.setAttribute('disabled', true);
            if (textAreaEmojiIcon) textAreaEmojiIcon.setAttribute('hidden', true);
            if (fileUploadButton) fileUploadButton.setAttribute('hidden', true);
            if (cameraUploadButton) cameraUploadButton.setAttribute('hidden', true);
            if (mediaFilesCloseButton) mediaFilesCloseButton.forEach(closeButton => closeButton.setAttribute('hidden', true));
        } else {
            textArea.removeAttribute('disabled');
            if (textAreaEmojiIcon) textAreaEmojiIcon.removeAttribute('hidden');
            if (fileUploadButton) fileUploadButton.removeAttribute('hidden');
            if (cameraUploadButton) cameraUploadButton.removeAttribute('hidden');
            if (mediaFilesCloseButton) mediaFilesCloseButton.forEach(closeButton => closeButton.removeAttribute('hidden'));
        }

    }, [post.postUploaded, post.postUploading]);


    // useEffect(() => {
    //     // if (post.onEdit) {
    //     //     setContent(post.content)
    //     //     setMedia(post.media)
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
                    <textarea name="content" value={content} spellCheck="false" autoFocus
                        placeholder={`${auth.user.username}, what are you thinking?`}
                        onChange={event => handleChangeContent(event.target.value)} />
                    <div className="d-flex">
                        <div className="flex-fill"></div>
                        <Icons setContent={handleChangeContent} content={content} />
                    </div>
                    <div className="show-images">
                        {
                            media.map((img, index) => (
                                <div key={index} id="file-img">
                                    {
                                        img.camera ? <ImageThumbnail src={img.camera} alt="imgThumbnail" />
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
                                    <span onClick={() => deleteMedia(index)}>&times;</span>
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
                                    <div className="file-upload">
                                        <i className="fas fa-image" />
                                        <input type="file" name="file" id="file" multiple
                                            accept="image/*,video/*" onChange={handleChangeImages} />
                                    </div>
                                </>
                        }
                    </div>
                </div>


                <div className="new-post-footer">

                    {post.postUploaded
                        ?
                        <div className="post-uploaded btn btn-primary btn-lg w-100 text-white">
                            Post Uploaded &nbsp; &nbsp;<i className="fas fa-check-circle"></i>
                        </div>
                        :
                        <>
                            {post.postUploading
                                ?
                                <div className="post-uploading btn btn-secondary w-100 text-white">
                                    Posting &nbsp; &nbsp;<i className="fas fa-spinner fa-pulse"></i>
                                </div>
                                :
                                <>
                                    <small className="form-text text-danger mb-2">
                                        {alert.newPostError ? alert.newPostError : ""}
                                    </small>
                                    <button className="post-button btn btn-secondary w-100" type="submit">
                                        Post
                                    </button>
                                </>
                            }
                        </>
                    }

                </div>


            </form>
        </div>
    );
}

export default NewPostModal;