import React from 'react'
import './Orders.css'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import {assets,currency,url} from '../../assets/assets.js'
import { useEffect } from 'react'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState('All')

  const token = localStorage.getItem('token')

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`, { headers: { Authorization: `Bearer ${token}` } })
    if (response.data.success) {
      setOrders(response.data.data.reverse())
    } else {
      toast.error('Error')
    }
  }

  const statusHandler = async (event, orderId) => {
    console.log(event, orderId)
    const response = await axios.post(
      `${url}/api/order/status`,
      {
        orderId,
        status: event.target.value
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data.success) {
      await fetchAllOrders()
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'All') return true
    return order.status === filterStatus
  })

  return (
    <div className='order add'>
      <h3>Order Page</h3>

      <div className='order-filter-controls'>
        <label htmlFor='statusFilter'>Filter by Status:</label>
        <select id='statusFilter' value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value='All'>Show All Orders</option>
          <option value='Food Processing'>Food Processing</option>
          <option value='Out for delivery'>Out for delivery</option>
          <option value='Delivered'>Delivered</option>
          <option value='Unlocked'>Unlocked</option>
        </select>
      </div>

      <div className='order-list'>
        {filteredOrders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt='' />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + ' x ' + item.quantity
                  } else {
                    return item.name + ' x ' + item.quantity + ', '
                  }
                })}
              </p>
              <p className='order-item-name'>{ order.address.name }</p>
              <div className='order-item-address'>
                <p>{order.address.address}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>{order.amount}{'.00' + currency}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status} name='' id=''>
              <option value='Food Processing'>Food Processing</option>
              <option value='Out for delivery'>Out for delivery</option>
              <option value='Delivered'>Delivered</option>
              <option value='Unlocked'>Unlocked</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders