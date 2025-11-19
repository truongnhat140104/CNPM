import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const [activeTab, setActiveTab] = useState("processing"); 
  
  const {url,token,currency} = useContext(StoreContext);

  const fetchOrders = async () => {
    const response = await axios.post(url+"/api/order/userorders",{},{headers:{Authorization:`Bearer ${token}`}});
    setData(response.data.data)
  }

  useEffect(()=>{
    if (token) {
      fetchOrders();
    }
  },[token])

  // ⬅️ LOGIC LỌC MỚI DỰA TRÊN TAB
  const filteredOrders = data.filter(order => {
    switch (activeTab) {
        case "processing":
            // Food Processing (đang chuẩn bị) và Pending (chờ xử lý)
            return ['Food Processing', 'Pending'].includes(order.status);
        case "prepare-for-delivery":
            // Ready for Pickup (Đã nấu xong)
            return order.status === 'Ready for Pickup';
        case "Delivering":
            return order.status === 'Delivering';
        case "delivered":
            return order.status === 'Delivered';
        case "reject":
            return order.status === 'Rejected';
        default:
            return true; // Nếu không khớp, hiển thị tất cả
    }
  });

  // ⬅️ LOGIC ĐẾM SỐ LƯỢNG ĐƠN HÀNG TRÊN MỖI TAB
  const getTabCount = (tabName) => {
    switch (tabName) {
        case "processing":
            return data.filter(o => ['Food Processing', 'Pending'].includes(o.status)).length;
        case "prepare-for-delivery":
            return data.filter(o => o.status === 'Ready for Pickup').length;
        case "Delivering":
            return data.filter(o => o.status === 'Delivering').length;
        case "delivered":
            return data.filter(o => o.status === 'Delivered').length;
        case "reject":
            return data.filter(o => o.status === 'Rejected').length;
        default:
            return 0;
    }
  }

  return (
    <div className='my-orders'>
      <div className="my-orders-header">
          <h2>My Orders</h2>
          
          <div className='my-orders-tabs-container'>
              <button
                  className={`tab-btn ${activeTab === 'processing' ? 'active' : ''}`}
                  onClick={() => setActiveTab('processing')}
              >
                  Processing ({getTabCount('processing')})
              </button>
              <button
                  className={`tab-btn ${activeTab === 'prepare-for-delivery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('prepare-for-delivery')}
              >
                  Prepare for delivery ({getTabCount('prepare-for-delivery')})
              </button>
              <button
                  className={`tab-btn ${activeTab === 'Delivering' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Delivering')}
              >
                  Delivering ({getTabCount('Delivering')})
              </button>
              <button
                  className={`tab-btn ${activeTab === 'delivered' ? 'active' : ''}`}
                  onClick={() => setActiveTab('delivered')}
              >
                  Delivered ({getTabCount('delivered')})
              </button>
              <button
                  className={`tab-btn ${activeTab === 'reject' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reject')}
              >
                  Reject ({getTabCount('reject')})
              </button>
          </div>
      </div>
      
      <div className="container">
        {filteredOrders.map((order,index)=>{
          return (
            <div key={index} className='my-orders-order'>
                <img src={assets.parcel_icon} alt="" />
                <p>{order.items.map((item,index)=>{
                  if (index === order.items.length-1) {
                    return item.name+" x "+item.quantity
                  }
                  else{
                    return item.name+" x "+item.quantity+", "
                  }
                  
                })}</p>
                <p>{order.amount}.00 {currency}</p>
                <p>Items: {order.items.length}</p>
                <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                
                {activeTab === 'Delivering' && (
                    <button onClick={fetchOrders}>Track Order</button>
                )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders