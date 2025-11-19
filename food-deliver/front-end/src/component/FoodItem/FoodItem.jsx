import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify';

const FoodItem = ({id, name, price, description, image, setShowLogin, setSelectedFoodItem, item, restaurantName}) => {
    const { addToCart, url, token} = useContext(StoreContext);
    const [localQuantity, setLocalQuantity] = useState(1);

    const handleUpdateCart = async () => {
        if (localQuantity <= 0) {
            toast.warning("Please select at least one item to add to cart.");
            return; 
        }
        try {
            await addToCart(id, localQuantity);
            toast.success(`Added ${localQuantity} ${name} to cart!`);
        } catch (error) {
            console.error("Failed to add items to cart:", error);
            toast.error("Failed to add items to cart!");
        }

        setLocalQuantity(1);
    };

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url + "/images/" + image} alt="" onClick={() => setSelectedFoodItem(item)}/>
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p className="food-item-restaurant"><img src={assets.restaurant} alt="restaurant icon" className='food-item-restaurant-icon'/> {restaurantName}</p>
                    <p>{name}</p>
                </div>
                <p className="food-item-desc">{description}</p>
                
                <div className="food-item-price-counter">
                    <p className="food-item-price">${price.toFixed(2)}</p>
                    <div className="food-item-counter-wrapper">
                        <div className="food-item-counter-container"> 
                            <div className="food-item-counter">
                                <img 
                                    onClick={() => setLocalQuantity(prev => Math.max(1, prev - 1))} 
                                    src={assets.remove_icon_red} 
                                    alt="" 
                                />
                                <p>{localQuantity}</p>
                                <img 
                                    onClick={() => setLocalQuantity(prev => prev + 1)} 
                                    src={assets.add_icon_green} 
                                    alt="" 
                                />
                            </div>
                            <button 
                                className='add-cart-btn' 
                                onClick={() => {
                                    if (token) {
                                        handleUpdateCart();
                                    } else {
                                        toast.info("Please log in to add items to your cart.");
                                        window.scrollTo({
                                            top: 0,
                                            behavior: 'smooth'
                                        });
                                        setShowLogin(true);
                                    }
                                }}
                            >
                                Adding cart
                            </button>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default FoodItem
