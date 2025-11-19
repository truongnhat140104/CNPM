import React, { useContext, useEffect, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate, useLocation } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy restaurantId từ state được gửi qua (từ YourCart)
  const restaurantId = location.state?.restaurantIdToCheckout;

  const { cartItems, food_list, removeFromCart, url } = useContext(StoreContext)

  // Lấy danh sách món ăn CỦA RIÊNG NHÀ HÀNG ĐÓ
  // Nếu không có restaurantId (vào trực tiếp link), mặc định là object rỗng
  const currentRestaurantCart = restaurantId ? cartItems[restaurantId] : {};

  const getCurrentCartTotal = () => {
    let totalAmount = 0;
    if (!currentRestaurantCart) return 0;

    for (const itemId in currentRestaurantCart) {
      const item = food_list.find((product) => product._id === itemId);
      if (item) {
        totalAmount += item.price * currentRestaurantCart[itemId];
      }
    }
    return totalAmount;
  }

  useEffect(() => {
    if (!restaurantId || !currentRestaurantCart) {
        navigate('/yourcart');
    }
  }, [restaurantId, navigate, currentRestaurantCart]);

  const subTotal = getCurrentCartTotal();
  const deliveryFee = subTotal === 0 ? 0 : 2;

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p> 
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
        </div>
      </div>
      <br />
      <hr />
      
      {/* 6. Map qua food_list nhưng kiểm tra trong currentRestaurantCart */}
      {food_list.map((item, index) => {
        // Kiểm tra xem món ăn có trong giỏ hàng CỦA NHÀ HÀNG NÀY không
        if (currentRestaurantCart && currentRestaurantCart[item._id] > 0) { 
          return (
            <div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={url + "/images/" + item.image} alt="" />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{currentRestaurantCart[item._id]}</p>
                <p>${(item.price * currentRestaurantCart[item._id]).toFixed(2)}</p>
              </div>
              <hr />
            </div>
          )
        }
        return null;
      })}

      <div>
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${subTotal.toFixed(2)}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${deliveryFee}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${(subTotal + deliveryFee).toFixed(2)}</b>
              </div>
            </div>
              {/* 8. Khi bấm Proceed, tiếp tục gửi restaurantId sang trang Order */}
              <button onClick={() => navigate('/order', { state: { restaurantIdToCheckout: restaurantId } })}>
                PROCEED TO CHECKOUT
              </button>
          </div>
          <div className="cart-promocode">
             {/* Promo code logic */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart