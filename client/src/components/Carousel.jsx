import React from "react";


const Carousel = ({ media, id }) => {

    const isActive = index => {
        if (index === 0) return "active";
    }


    return (
        <div id={`image${id}`} className="carousel slide" data-ride="carousel">

            <ol className="carousel-indicators" style={{ zIndex: 1 }}>
                {
                    media.map((img, index) => (
                        <li key={index} data-target={`#image${id}`}
                            data-slide-to={index} className={isActive(index)} />
                    ))
                }
            </ol>

            <div className="carousel-inner">
                {
                    media.map((img, index) => (
                        <div key={index} className={`carousel-item ${isActive(index)} w-100`}>
                            {
                                img.url.match(/video/i)
                                    ? <video controls src={img.url} className="d-block w-100" alt={img.url} />
                                    : <img src={img.url} className="d-block w-100" alt={img.url} />
                            }
                        </div>
                    ))
                }
            </div>

            {
                media && media.length > 1 &&
                <>
                    <a className="carousel-control-prev" href={`#image${id}`} role="button" data-slide="prev"
                        style={{ width: '5%' }}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href={`#image${id}`} role="button" data-slide="next"
                        style={{ width: '5%' }}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </>
            }

        </div>
    );
}

export default Carousel;