
const VideoThumbnail = ({ src, alt }) => {
    return (
        <video controls src={src} className="img-thumbnail" alt={alt} />
    );
}

export default VideoThumbnail;