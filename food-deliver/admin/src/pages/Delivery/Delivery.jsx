import React, { useState, useEffect } from 'react';
import './Delivery.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets, currency } from '../../assets/assets';

const Delivery = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('requests'); 
  const token = localStorage.getItem('token');
  const [foodList, setFoodList] = useState([]); // Danh sách món ăn để lấy tên nhà hàng

  const fetchData = async () => {
    try {
      const [ordersRes, foodsRes] = await Promise.all([
          axios.post(`${url}/api/order/list`, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${url}/api/food/all`) // Gọi để lấy tên nhà hàng
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data.reverse());
      }
      if (foodsRes.data.success) {
        setFoodList(foodsRes.data.data);
      }
    } catch (error) {
      toast.error("Error loading data");
    }
  };

  // Hàm gọi Drone (Gửi request xuống Backend)
  const handleDispatchDrone = async (orderId) => {
    try {
      const response = await axios.post(`${url}/api/drone/dispatch`, { orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchData(); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error dispatching drone");
    }
  };

  // HÀM MỚI: Xử lý các bước tiếp theo (Next Step)
  const handleNextStep = async (orderId, action) => {
    try {
        const response = await axios.post(`${url}/api/drone/next-step`, { orderId, action }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
            toast.success("Updated status successfully");
            fetchData();
        }
    } catch (error) {
        toast.error("Error updating status");
    }
  }

  // HÀM MỞ TRACKING (Demo)
  const handleTrackDrone = (orderId) => {
      alert(`Open Map Tracking for Order: #${orderId}`);
  }

  const getRestaurantName = (resId) => {
      const food = foodList.find(f => f.restaurantId === resId || f.restaurantId?._id === resId);
      return food ? food.restaurantName : "Unknown Restaurant";
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 1. HÀM GOM NHÓM ĐƠN HÀNG THEO NHÀ HÀNG (GIỮ NGUYÊN) ---
  const groupOrdersByRestaurant = (orderList) => {
    const groups = {};
    orderList.forEach(order => {
        const resId = order.restaurantId || 'unknown'; 
        if (!groups[resId]) {
            groups[resId] = [];
        }
        groups[resId].push(order);
    });
    return groups;
  };

  // --- 2. LOGIC LỌC VÀ CHUẨN BỊ DỮ LIỆU ---
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'requests') return order.status === 'Ready for Pickup';
    if (activeTab === 'delivering') return ['Drone Moving', 'Out for delivery'].includes(order.status);
    if (activeTab === 'returning') return order.status === 'Returning';
    if (activeTab === 'delivered') return order.status === 'Delivered';
    return false; // Mặc định không hiển thị gì nếu tab rỗng
  });

  // ⬅️ LUÔN GOM NHÓM TẤT CẢ CÁC ĐƠN HÀNG ĐÃ LỌC
  const groupedOrders = groupOrdersByRestaurant(filteredOrders);


  return (
    <div className='delivery-page'>
      <h2>Drone Delivery Control</h2>

      {/* TABS NAVIGATION */}
      <div className="delivery-tabs">
        <button 
          className={activeTab === 'requests' ? 'active' : ''} 
          onClick={() => setActiveTab('requests')}
        >
          Requests ({orders.filter(o => o.status === 'Ready for Pickup').length})
        </button>
        <button 
          className={activeTab === 'delivering' ? 'active' : ''} 
          onClick={() => setActiveTab('delivering')}
        >
          Delivering ({orders.filter(o => ['Drone Moving', 'Out for delivery'].includes(o.status)).length})
        </button>
        <button 
          className={activeTab === 'returning' ? 'active' : ''} 
          onClick={() => setActiveTab('returning')}
        >
          Returning ({orders.filter(o => o.status === 'Returning').length})
        </button>
        <button 
          className={activeTab === 'delivered' ? 'active' : ''} 
          onClick={() => setActiveTab('delivered')}
        >
          Delivered ({orders.filter(o => o.status === 'Delivered').length})
        </button>
      </div>

      <div className="delivery-list">
        
        {/* --- KHUNG RENDER THỐNG NHẤT (LUÔN GOM NHÓM) --- */}
        {Object.keys(groupedOrders).length > 0 ? (
            Object.keys(groupedOrders).map(resId => (
                <div key={resId} className="restaurant-group">
                    
                    {/* Header của nhóm Nhà hàng */}
                    <div className="restaurant-header">
                        <h3>Restaurant Name: {getRestaurantName(resId)}</h3>
                    </div>

                    {/* Danh sách các đơn hàng con trong nhóm */}
                    <div className="group-items">
                        {groupedOrders[resId].map(order => (
                            <div key={order._id} className="delivery-card small-card">
                                <div className="card-icon">
                                    <img src={assets.parcel_icon} alt="" />
                                </div>
                                <div className="card-info">
                                    {order.assignedDrone && (
                                      <div className="assigned-drone-badge">
                                        <strong>{order.assignedDrone.serialNumber}</strong> 
                                        <span style={{ marginLeft: '5px', fontSize: '12px', color: order.assignedDrone.battery < 30 ? 'red' : 'green' }}>
                                          (Pin: {order.assignedDrone.battery}%)
                                        </span>
                                      </div>
                                    )}
                                    <h4>Order ID: #{order._id.slice(-6)}</h4>
                                    <p><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
                                    <p><strong>To:</strong> {order.address.address}</p>
                                    <p className="price-tag">{order.amount} {currency}</p>
                                </div>
                                
                                {/* --- CỘT ACTIONS (Logic hành động) --- */}
                                <div className="card-actions">
                                    
                                    {/* TAB REQUESTS */}
                                    {activeTab === 'requests' && (
                                        <button className="btn-dispatch" onClick={() => handleDispatchDrone(order._id)}>
                                            Send Drone
                                        </button>
                                    )}

                                    {/* TAB DELIVERING */}
                                    {activeTab === 'delivering' && (
                                        <div className="delivering-actions">
                                            <button className="btn-track" onClick={() => handleTrackDrone(order._id)}>
                                                Track
                                            </button>

                                            {order.status === 'Drone Moving' ? (
                                                <button 
                                                    className="status-btn moving"
                                                    onClick={() => handleNextStep(order._id, 'arrived_res')}
                                                >
                                                    Flying To Restaurant <br/><small>(Click when Arrived)</small>
                                                </button>
                                            ) : (
                                                <button 
                                                    className="status-btn delivering"
                                                    onClick={() => handleNextStep(order._id, 'delivered')}
                                                >
                                                    Flying To Customer <br/><small>(Click when Delivered)</small>
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* TAB RETURNING */}
                                    {activeTab === 'returning' && (
                                        <div className="delivering-actions">
                                            <button className="btn-track" onClick={() => handleTrackDrone(order._id)}>
                                                Track
                                            </button>
                                            <button 
                                                className="status-btn returning"
                                                onClick={() => handleNextStep(order._id, 'returned')}
                                            >
                                                Drone Returning <br/><small>(Click when Landed)</small>
                                            </button>
                                        </div>
                                    )}

                                    {/* TAB DELIVERED */}
                                    {activeTab === 'delivered' && (
                                        <span className="status-tag completed">Completed</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        ) : 
        
        /* --- TRƯỜNG HỢP KHÔNG CÓ DỮ LIỆU --- */
        (
            <p className="no-data">No orders in this stage.</p>
        )}
      </div>
    </div>
  )
}

export default Delivery;