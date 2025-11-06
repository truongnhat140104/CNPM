import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import './FoodItemDetail.css'

/**
 * @param {object} props
 * @param {object} props.foodItem
 * @param {function} props.onClose
 */

const FoodItemDetail = ({ foodItem, onClose }) => {
    const {
        url,
        currency,
        addToCart,
        token,
        setShowLogin
    } = useContext(StoreContext);

    const [localQuantity, setLocalQuantity] = useState(1);

    const handleAddToCart = async () => {
        if (!token) {
            toast.info("You need to log in to add items to the cart.");
            setShowLogin(true);
            return;
        }

        if (localQuantity > 0) {
            try {
                await addToCart(foodItem._id, localQuantity);
                toast.success(`Added ${localQuantity} ${foodItem.name} to cart!`);
            } catch (error) {
                toast.error("Failed to add item to cart.");
                console.error(error);
            }
        }
        onClose();
    };

    const increaseQuantity = () => {
        setLocalQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        setLocalQuantity(prev => Math.max(1, prev - 1));
    };

    if (!foodItem) {
        return null;
    }

    return (
        <div className="food-item-detail-overlay">
            <div className="food-item-detail-content animate-fade-in">
                <img 
                    src={assets.cross_icon}
                    alt="Close"
                    onClick={onClose}
                    className="food-item-detail-close-icon"
                    onError={(e) => e.target.style.display = 'none'}
                />

                <div className="food-item-detail-body">
                    <div className="food-item-detail-image-wrapper">
                        <img 
                            className="food-item-detail-image"
                            src={url + "/images/" + foodItem.image} 
                            alt={foodItem.name}
                            onError={(e) => e.target.src = 'https://placehold.co/400x400/eeeeee/cccccc?text=Image+Not+Found'}
                        />
                    </div>

                    <div className="food-item-detail-info">
                        
                        <h2 className="food-item-detail-name">{foodItem.name}</h2>
                        
                        <p className="food-item-detail-price">
                            {'$'}{(foodItem.price).toFixed(2)}
                        </p>
                        
                        <p className="food-item-detail-desc">
                            {foodItem.description}
                        </p>
                        
                        <div className="food-item-detail-quantity-section">
                            <div className="food-item-detail-counter">
                                <img 
                                    src={assets.remove_icon_red} 
                                    alt="Remove"
                                    onClick={decreaseQuantity}
                                    className="counter-icon"
                                />
                                <span className="counter-quantity">{localQuantity}</span>
                                <img 
                                    src={assets.add_icon_green} 
                                    alt="Add"
                                    onClick={increaseQuantity}
                                    className="counter-icon"
                                />
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleAddToCart}
                            className="food-item-detail-button"
                        >
                            Adding to cart
                        </button>
                    </div>
                </div>
            </div>   
        </div>
    );
}

export default FoodItemDetail;