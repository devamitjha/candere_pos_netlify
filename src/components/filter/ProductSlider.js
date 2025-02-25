import React, { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import productImage from "../../assets/images/C014398__1.jpeg";
import close from "../../assets/images/close.svg";

const ProductSlider = ({ itemImages, itemName }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openFullScreen = (image) => {
        setSelectedImage(image);
        setIsFullScreen(true);
    };

    const closeFullScreen = () => {
        setIsFullScreen(false);
        setSelectedImage(null);
    };

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
    };

    return (
        <>
            <Slider {...settings}>
                {itemImages.map(image => (
                    <div key={image.id} className="sliderImage" onClick={() => openFullScreen(image)}>
                        <img 
                            src={image.metal_image}  // Replace with image.metal_image if needed
                            alt={image.label} 
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                ))}
            </Slider>

            {/* Full-Screen Image Viewer */}
            {isFullScreen && (
                <div className="fullScreenOverlay">
                    <img src={close} alt='BottomSheet Close' className='img-fluid closeButton' onClick={closeFullScreen}/>
                    <div className="fullScreenContent">
                        {itemImages.map(image => (
                            <div key={image.id} className="fullScreenImage">
                                <img 
                                    src={image.metal_image} 
                                    alt={image.label} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductSlider;
