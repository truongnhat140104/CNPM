import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const [filterStatus, setFilterStatus] = useState("All"); // ⬅️ THÊM STATE LỌC
  
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

  const filteredOrders = data.filter(order => {
    if (filterStatus === "All") return true;
    return order.status === filterStatus;
  });

  return (
    <div className='my-orders'>
      <div className="my-orders-header">
          <h2>My Orders</h2>
            <div className='my-orders-filter-controls'>
              <label htmlFor="statusFilter">Filter by Status:</label>
              <select 
                  id="statusFilter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
              >
                  <option value="All">Show All Orders</option>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Unlocked">Unlocked</option>
              </select>
          </div>
      </div>
      {/* ------------------------------- */}
      
      <div className="container">
        {/* DUYỆT QUA DANH SÁCH ĐÃ LỌC */}
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
                <button onClick={fetchOrders}>Track Order</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders