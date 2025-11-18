import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const Sidebar = ({ setIsLoggedIn }) => { 
    const navigate = useNavigate();
    
    const logout = () => {
        localStorage.removeItem("token");
        
        if(setIsLoggedIn) {
            setIsLoggedIn(false); 
        }
        
        toast.success("Logged out successfully!");
        navigate('/login');
        
        // window.location.reload(); 
    }

  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/account' className="sidebar-option">
                <img src={assets.user} alt="" className='icon_size'/>
                <p>Account</p>
            </NavLink>
            <NavLink to='/add' className="sidebar-option">
                <img src={assets.add} alt="" className='icon_size'/>
                <p>Add item</p>
            </NavLink>
            <NavLink to='/list' className="sidebar-option">
                <img src={assets.list} alt="" className='icon_size'/>
                <p>List item</p>
            </NavLink>
            <NavLink to='/orders' className="sidebar-option">
                <img src={assets.order} alt="" className='icon_size'/>
                <p>Order</p>
            </NavLink>
        </div>
        
        <div className='sidebar-logout'>
            <NavLink to='/login' className="logout-btn sidebar-option" onClick={logout}>
                <img src={assets.logout} alt="" className='icon_size'/> 
                <p>Logout</p>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar