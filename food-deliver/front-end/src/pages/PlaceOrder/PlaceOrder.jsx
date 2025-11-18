import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from "../../context/StoreContext"
import axios from 'axios'
import { toast } from 'react-toastify';

const PlaceOrder = () => {

  // 1. Bỏ getTotalCartAmount từ context vì ta tự tính riêng
  const { token, cartItems, food_list, url } = useContext(StoreContext)
  const location = useLocation();
  const navigate = useNavigate();

  // 2. Lấy ID nhà hàng từ trang trước gửi qua
  const restaurantId = location.state?.restaurantIdToCheckout;
  
  const [data, setData] = useState({
        name: "",
        email: "",
        address: "",
        phone: ""
    })

  // 3. Hàm tính tổng tiền CHỈ CHO NHÀ HÀNG ĐANG CHỌN
  const getRestaurantTotal = () => {
    let totalAmount = 0;
    // Kiểm tra xem có ID nhà hàng và giỏ hàng của nhà hàng đó không
    if (restaurantId && cartItems[restaurantId]) {
      for (const itemId in cartItems[restaurantId]) {
        if (cartItems[restaurantId][itemId] > 0) {
          let itemInfo = food_list.find((product) => product._id === itemId);
          if (itemInfo) {
            totalAmount += itemInfo.price * cartItems[restaurantId][itemId];
          }
        }
      }
    }
    return totalAmount;
  }

  // Tính toán ngay giá trị hiện tại
  const currentTotal = getRestaurantTotal();

  const onChangeHandler = (event) => {
      const name = event.target.name
      const value = event.target.value
      setData(data => ({...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault();   
    
    let orderData = {
        address: data,
        restaurantId: restaurantId, // 4. Gửi ID nhà hàng lên server
        amount: currentTotal + 2 // Gửi kèm tổng tiền (đã cộng ship)
    } 

    try {
      let response = await axios.post(url+"/api/order/place", orderData, { headers:{Authorization:`Bearer ${token}`} });
      
      console.log(response.data);
      
      if (response.data.success) {
        const {session_url} = response.data;
        window.location.replace(session_url);
      }
      else{
        toast.error(response.data.message || "Lỗi đặt hàng");
        console.log(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error placing order. Please try again.");
    }
  }

  useEffect(()=>{
    if (!token) {
      navigate('/cart')
    }
    // Nếu không có ID nhà hàng hoặc tổng tiền = 0 thì quay về cart
    else if(!restaurantId || currentTotal === 0) {
      navigate('/cart')
    }
  },[token, restaurantId, currentTotal, navigate])


  return (
    <div>
      <form onSubmit={placeOrder} className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input required name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Name' />
          </div>
          <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
          <input  required name='address' onChange={onChangeHandler} value={data.address} type="text" placeholder='Address' />
          <div className="multi-fields">
          </div>
          <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='phone' />
        </div>
        <div className="place-order-right">
        <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${currentTotal.toFixed(2)}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery free</p>
                <p>${currentTotal === 0 ? 0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${currentTotal === 0 ? 0 : (currentTotal + 2).toFixed(2)}</b>
              </div>
            </div>
              <button type='submit' >PROCEED TO PAYMENT</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PlaceOrder