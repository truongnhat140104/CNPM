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
        addItemsToCart,
        token,
        setShowLogin
    } = useContext(StoreContext);

    // State cục bộ để theo dõi số lượng người dùng muốn thêm
    const [localQuantity, setLocalQuantity] = useState(1);

    const handleAddToCart = async () => {
        if (!token) {
            toast.warn("Bạn cần đăng nhập để thêm vào giỏ hàng");
            setShowLogin(true); // Mở popup đăng nhập
            onClose(); // Đóng popup chi tiết
            return;
        }

        // 2. Gọi hàm addItemsToCart từ Context
        if (localQuantity > 0) {
            try {
                await addItemsToCart(foodItem._id, localQuantity);
                toast.success(`Added ${localQuantity} ${foodItem.name} to cart!`);
            } catch (error) {
                toast.error("Failed to add to cart!");
                console.error(error);
            }
        }
        // 3. Đóng popup sau khi thêm
        onClose();
    };

    // Hàm tăng/giảm số lượng
    const increaseQuantity = () => {
        setLocalQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        // Giữ số lượng tối thiểu là 1
        setLocalQuantity(prev => Math.max(1, prev - 1));
    };

    // Nếu không có foodItem (đã bị đóng), không render gì cả
    if (!foodItem) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in">
                <img 
                    src={assets.cross_icon}
                    alt="Close"
                    onClick={onClose}
                    className="absolute top-4 right-4 w-6 h-6 cursor-pointer opacity-70 hover:opacity-100"
                    onError={(e) => e.target.style.display = 'none'}
                />

                <div className="md:flex">
                    <div className="md:w-1/2 p-6 flex justify-center items-center">
                        <img 
                            className="w-full h-auto max-h-80 object-cover rounded-lg shadow-md"
                            src={url + "/images/" + foodItem.image} 
                            alt={foodItem.name}
                            onError={(e) => e.target.src = 'https://placehold.co/400x400/eeeeee/cccccc?text=Image+Not+Found'}
                        />
                    </div>

                    <div className="md:w-1/2 p-6 flex flex-col justify-center">
                        
                        {/* Tên sản phẩm */}
                        <h2 className="text-3xl font-bold mb-3 text-gray-800">{foodItem.name}</h2>
                        
                        {/* Giá */}
                        <p className="text-2xl font-semibold text-orange-600 mb-4">
                            {foodItem.price.toLocaleString('vi-VN')} {currency}
                        </p>
                        
                        {/* Mô tả */}
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            {foodItem.description}
                        </p>
                        
                        {/* Bộ đếm số lượng */}
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-lg font-medium text-gray-700">Số lượng:</h3>
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1 shadow-inner">
                                <img 
                                    src={assets.remove_icon_red} 
                                    alt="Remove"
                                    onClick={decreaseQuantity}
                                    className="w-8 h-8 cursor-pointer"
                                />
                                <span className="text-xl font-medium w-8 text-center">{localQuantity}</span>
                                <img 
                                    src={assets.add_icon_green} 
                                    alt="Add"
                                    onClick={increaseQuantity}
                                    className="w-8 h-8 cursor-pointer"
                                />
                            </div>
                        </div>
                        
                        {/* Nút Thêm vào giỏ hàng */}
                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
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