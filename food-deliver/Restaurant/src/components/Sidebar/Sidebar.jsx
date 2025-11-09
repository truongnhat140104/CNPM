import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/user' className="sidebar-option">
                <img src={assets.user_icon} alt="" className='icon_size'/>
                <p>User</p>
            </NavLink>
            <NavLink to='/add' className="sidebar-option">
                <img src={assets.add_icon} alt="" className='icon_size'/>
                <p>Add item</p>
            </NavLink>
            <NavLink to='/list' className="sidebar-option">
                <img src={assets.list_icon} alt="" className='icon_size'/>
                <p>List item</p>
            </NavLink>
            <NavLink to='orders' className="sidebar-option">
                <img src={assets.order_icon} alt="" className='icon_size'/>
                <p>Order</p>
            </NavLink>
        </div>
        
    </div>
  )
}

export default Sidebar