import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';     

const Sidebar = () => {

    const navigate = useNavigate();
    const logout = () => {
        toast.success("Logged out successfully!");
        localStorage.removeItem("token");
        navigate('/login');
        window.location.reload();
    }

  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/user' className="sidebar-option">
                <img src={assets.user_icon} alt="" className='icon_size'/>
                <p>Account</p>
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
        <div className='sidebar-logout'>
            <NavLink to='logout' className="logout-btn sidebar-option" onClick={ logout }>
                <img src={assets.order_icon} alt="" className='icon_size'/>
                <p>Logout</p>
            </NavLink>
        </div>
        
    </div>
  )
}

export default Sidebar