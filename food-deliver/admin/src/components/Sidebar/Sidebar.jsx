import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/user' className="sidebar-option">
                <img src={assets.user} alt="" className='icon_size'/>
                <p>User</p>
            </NavLink>
            <NavLink to='/addingres' className="sidebar-option">
                <img src={assets.add} alt="" className='icon_size'/>
                <p>Restaurant</p>
            </NavLink>
            <NavLink to='/drone' className="sidebar-option">
                <img src={assets.drone} alt="" className='icon_size'/>
                <p>Drone Manager</p>
            </NavLink>
            <NavLink to='/delivery' className="sidebar-option">
                <img src={assets.delivery} alt="" className='icon_size'/>
                <p>Delivery</p>
            </NavLink>
        </div>
        
    </div>
  )
}

export default Sidebar