import React, { useState, useEffect } from 'react'
import './Orders.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets, currency, url } from '../../assets/assets.js'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('requests')

  const token = localStorage.getItem('token')

  const fetchOrders = async () => {
    // ⬅️ ĐÃ SỬA: SỬ DỤNG AXIOS.POST VÀ BODY RỖNG ĐỂ ĐỒNG BỘ VỚI CLIENT
    // Giả định Backend /api/order/list xử lý POST/token để lọc theo Restaurant ID
    const response = await axios.post(
        `${url}/api/order/list`, 
        {}, // Gửi body rỗng
        { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      setOrders(response.data.data.reverse())
    } else {
      toast.error('Error fetching orders')
    }
  }

  // ... (các hàm updateStatus, useEffect, logic lọc, và phần return JSX giữ nguyên) ...

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${url}/api/order/status`,
        {
          orderId,
          status: newStatus
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        await fetchOrders()
        toast.success(`Order updated to: ${newStatus}`)
      }
    } catch (error) {
      console.log(error)
      toast.error('Error updating status')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getFilteredOrders = () => {
    if (activeTab === 'requests') {
      return orders.filter(order => order.status === 'Food Processing' || order.status === 'Pending')
    } else if (activeTab === 'kitchen') {
      return orders.filter(order => ['Cooking', 'Ready for Pickup'].includes(order.status))
    } else if (activeTab === 'delivering') {
      return orders.filter(order => order.status === 'Delivering')
    } else if (activeTab === 'delivered') {
      return orders.filter(order => order.status === 'Delivered')
    } else if (activeTab === 'rejected') {
      return orders.filter(order => order.status === 'Rejected')
    }
    return []
  }

  const filteredOrders = getFilteredOrders()

  const requestCount = orders.filter(o => o.status === 'Food Processing').length
  const kitchenCount = orders.filter(o => ['Cooking', 'Ready for Pickup'].includes(o.status)).length
  const deliveringCount = orders.filter(o => o.status === 'Delivering').length
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length
  const rejectedCount = orders.filter(o => o.status === 'Rejected').length

  return (
    <div className='order add'>
      <h3>Order Management</h3>

      <div className='tabs-container'>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          New Requests ({requestCount})
        </button>
        <button
          className={`tab-btn ${activeTab === 'kitchen' ? 'active' : ''}`}
          onClick={() => setActiveTab('kitchen')}
        >
          Cooking & Pickup ({kitchenCount})
        </button>

        <button
          className={`tab-btn ${activeTab === 'delivering' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivering')}
        >
          Delivering ({deliveringCount})
        </button>

        <button
          className={`tab-btn ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered ({deliveredCount})
        </button>

        <button
          className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      <div className='order-list'>
        {filteredOrders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt='' />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return item.name + ' x ' + item.quantity
                  } else {
                    return item.name + ' x ' + item.quantity + ', '
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.name}</p>
              <div className='order-item-address'>
                <p>{order.address.address}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>

            <div className='order-info-right'>
              <p>Items: {order.items.length}</p>
              <p>
                {order.amount} {currency}
              </p>

              <span className={`status-badge ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className='order-actions'>
              {activeTab === 'requests' && (
                <div className='action-buttons'>
                  <button className='btn-accept' onClick={() => updateStatus(order._id, 'Cooking')}>
                    Accept Order (Start Cooking)
                  </button>
                  <button className='btn-reject' onClick={() => updateStatus(order._id, 'Rejected')}>
                    Reject
                  </button>
                </div>
              )}

              {activeTab === 'kitchen' && (
                <div className='action-buttons'>
                  {order.status === 'Cooking' && (
                    <button className='btn-ready' onClick={() => updateStatus(order._id, 'Ready for Pickup')}>
                      Food Ready (Call Drone)
                    </button>
                  )}

                  {order.status === 'Ready for Pickup' && (
                    <div className='drone-waiting'>
                      <button className='btn-go' onClick={() => updateStatus(order._id, 'Delivering')}>
                        Drone Loaded (Go!)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'delivering' && order.status === 'Delivering' && (
                <div className='delivering-text'>
                  <p className='delivered-text'>Delivering</p>
                </div>
              )}

              {activeTab === 'delivered' && order.status === 'Delivered' && (
                <p className='delivered-text'>Successfully Delivered</p>
              )}

              {activeTab === 'rejected' && order.status === 'Rejected' && (
                <p className='rejected-text'>Order was rejected.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders