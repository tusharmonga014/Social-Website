import React from "react";
import {
    WhatsappShareButton, WhatsappIcon,
    FacebookShareButton, FacebookIcon,
    TwitterShareButton, TwitterIcon,
    EmailShareButton, EmailIcon,
    TelegramShareButton, TelegramIcon,
} from "react-share";


const ShareModal = ({ url }) => {

    return (
        <div className="d-flex justify-content-between px-4 py-2">

            <WhatsappShareButton url={url} >
                <WhatsappIcon round={true} size={32} />
            </WhatsappShareButton>

            <FacebookShareButton url={url} >
                <FacebookIcon round={true} size={32} />
            </FacebookShareButton>

            <TwitterShareButton url={url} >
                <TwitterIcon round={true} size={32} />
            </TwitterShareButton>

            <EmailShareButton url={url} >
                <EmailIcon round={true} size={32} />
            </EmailShareButton>

            <TelegramShareButton url={url} >
                <TelegramIcon round={true} size={32} />
            </TelegramShareButton>

        </div>
    );
}

export default ShareModal;