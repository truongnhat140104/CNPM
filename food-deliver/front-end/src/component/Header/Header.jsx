import React, { useState, useEffect } from 'react';
import './Header.css';
import { assets } from '../../assets/assets';
const sliderImages = [
    assets.hd_bakery,
    assets.hd_fastfood,
    assets.hd_maincourse,
    assets.hd_drinks,
    assets.hd_dessert,
];

const Header = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            goToNext();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [currentImageIndex]);

    const goToNext = () => {
        const isLastSlide = currentImageIndex === sliderImages.length - 1;
        const newIndex = isLastSlide ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
    };

    const goToPrevious = () => {
        const isFirstSlide = currentImageIndex === 0;
        const newIndex = isFirstSlide ? sliderImages.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentImageIndex(slideIndex);
    };

    return (
        <div className='header'>
            <div className="header-slider">
                {sliderImages.map((image, index) => (
                    <div
                        key={index}
                        className="header-slide"
                        style={{
                            backgroundImage: `url(${image})`,
                            opacity: index === currentImageIndex ? 1 : 0,
                        }}
                    ></div>
                ))}
            </div>

            <div className="header-contents">
                <h2>Order Your Favorite Food Here</h2>
                <button onClick={() => window.location.href = '/menu'}>View Menu</button>
            </div>

            <button onClick={goToPrevious} className="slider-arrow prev-arrow">
                &#10094;
            </button>
            <button onClick={goToNext} className="slider-arrow next-arrow">
                &#10095;
            </button>

            <div className="slider-dots">
                {sliderImages.map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        className={`slider-dot ${currentImageIndex === slideIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(slideIndex)}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default Header;