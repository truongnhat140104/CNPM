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
            <NavLink to='/restaurant' className="sidebar-option">
                <img src={assets.add_icon} alt="" className='icon_size'/>
                <p>Restaurant</p>
            </NavLink>
        </div>
        
    </div>
  )
}

export default Sidebar