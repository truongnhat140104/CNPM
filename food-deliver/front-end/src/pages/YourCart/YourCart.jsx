import React, { useContext } from 'react';
import './YourCart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const YourCart = () => {
  const { cartItems, food_list, url, currency, removeFromCart, addToCart, deleteItemFromCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const restaurantIds = Object.keys(cartItems);

  const getRestaurantName = (restaurantCart) => {
    try {
      const firstFoodId = Object.keys(restaurantCart)[0];
      const foodItem = food_list.find((item) => item._id === firstFoodId);
      // Hiển thị tên nhà hàng hoặc ID nếu không tìm thấy tên
      return foodItem?.restaurantName || "Unknown Restaurant";
    } catch (error) {
      return "Restaurant";
    }
  };

  const handleCheckout = (restaurantId) => {
    navigate('/cart', { state: { restaurantIdToCheckout: restaurantId } });
  };

  const hasActiveCarts = restaurantIds.some(resId => {
      const restaurantCart = cartItems[resId];
      if (!restaurantCart) return false;
      return Object.values(restaurantCart).some(qty => qty > 0);
  });

  return (
    <div className='your-cart'>
      <div className="cart-container">
        {!hasActiveCarts ? (
          <div className='cart-empty'>
            <h2>Your cart is empty.</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
          </div>
        ) : (
          <>
            <h2 className='cart-title'>Your Carts</h2>
            <p className='cart-subtitle'>You have items from different restaurants. Please check out each one separately.</p>

            {restaurantIds.map((resId) => {
              const restaurantCart = cartItems[resId];
              if (!restaurantCart) return null; 
              const itemIds = Object.keys(restaurantCart);
              let subtotal = 0;
              
              const renderedItems = itemIds.map((foodId) => {
                const item = food_list.find((product) => product._id === foodId);
                const quantity = restaurantCart[foodId];
                
                if (item && quantity > 0) {
                   const itemTotal = item.price * quantity;
                   subtotal += itemTotal;
                   return { item, quantity, itemTotal };
                }
                return null;
              }).filter(Boolean);

              if (subtotal === 0) {
                  return null;
              }

              // 3. NẾU CÓ TIỀN, MỚI RENDER GIAO DIỆN
              return (
                <div key={resId} className='restaurant-cart-summary'>
                  
                  <h3 className='restaurant-cart-name'>{getRestaurantName(restaurantCart)}</h3>
                  
                  <div className="cart-items-list">
                    {renderedItems.map(({ item, quantity, itemTotal }) => (
                        <div key={item._id} className='cart-item-row'>
                            <img src={url + "/images/" + item.image} alt={item.name} className='cart-item-image' />
                            <p className='cart-item-name'>{item.name}</p>
                            <p className='cart-item-price'>{item.price.toFixed(2)} {currency}</p>

                            <div className='quantity-control'>
                                {/* Nút Giảm (-) gọi removeFromCart */}
                                <button onClick={() => removeFromCart(item._id, resId)}>-</button>
                                
                                <span>{quantity}</span>
                                
                                {/* Nút Tăng (+) gọi addToCart */}
                                <button onClick={() => addToCart(item._id)}>+</button>
                            </div>

                            <p className='cart-item-quantity'>x {quantity}</p>
                            <p className='cart-item-total'>{itemTotal.toFixed(2)} {currency}</p>
                            <p 
                              onClick={() => deleteItemFromCart(item._id, resId)} 
                              className='cart-item-remove'>x</p>
                        </div>
                    ))}
                  </div>
                  
                  <div className='restaurant-cart-footer'>
                    <div className='restaurant-cart-subtotal'>
                      <p>Subtotal</p>
                      <p>{subtotal.toFixed(2)} {currency}</p>
                    </div>
                    <button onClick={() => handleCheckout(resId)}>
                      Checkout This Cart ({subtotal.toFixed(2)} {currency})
                    </button>
                  </div>

                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default YourCart;