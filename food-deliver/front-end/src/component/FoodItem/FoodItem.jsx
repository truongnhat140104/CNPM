import React, { useContext, useState } from 'react' // Bỏ useEffect
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify';

const FoodItem = ({id, name, price, description, image, setShowLogin}) => {
    const { addToCart, url, token} = useContext(StoreContext);
    const [localQuantity, setLocalQuantity] = useState(0);

    const handleUpdateCart = async () => {
        if (localQuantity <= 0) {
            return; 
        }

        // Tạo mảng tác vụ (thêm 'localQuantity' lần)
        const tasks = [];
        for (let i = 0; i < localQuantity; i++) {
            tasks.push(addToCart(id));
        }

        try {
            await Promise.all(tasks);
            toast.success(`Đã thêm ${localQuantity} ${name} vào giỏ hàng!`);
        } catch (error) {
            console.error("Failed to add items to cart:", error);
            toast.error("Thêm vào giỏ hàng thất bại!");
        }

        // 4. Reset số lượng tạm về 0 (theo yêu cầu)
        setLocalQuantity(0);
    };
    // --- KẾT THÚC LOGIC MỚI ---


    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url + "/images/" + image} alt="" />
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                </div>
                <p className="food-item-desc">{description}</p>
                
                <div className="food-item-price-counter">
                    <p className="food-item-price">${price}</p>
                    <div className="food-item-counter-wrapper">
                        <div className="food-item-counter-container"> 
                            <div className="food-item-counter">
                                <img 
                                    onClick={() => setLocalQuantity(prev => Math.max(0, prev - 1))} 
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
                                onClick={handleUpdateCart}
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