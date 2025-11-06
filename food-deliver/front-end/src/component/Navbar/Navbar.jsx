import React, {useContext, useState} from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
const Navbar = ({setShowLogin}) => {

    const [menu,setMenu] = useState("menu");

    const {getTotalCartAmount,token,setToken} = useContext(StoreContext);

    const navigate = useNavigate();
    const logout = () => {
      localStorage.removeItem("token");
      setToken("");
      navigate("/");
    }

  return (
    <div className='navbar'>
     <Link to='/'><img src={assets.logo1} alt="" className='logo'/></Link>
     <ul className="navbar-menu">
        <Link to='/' onClick={()=>setMenu("home")} className={menu === "home" ? "active" : ""} >Home</Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu === "menu" ? "active" : ""} >Menu</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""} >Contact Us</a>
     </ul>
     <div className="navbar-right">
        {/* <img src={assets.search_icon} alt="" className='search-icon' /> */}
        <div className="navbar-search-icon">
            <img 
              onClick={() => {
                if (!token) {
                  toast.info("Please sign in to view your cart.");
                  setShowLogin(true); // Nếu chưa đăng nhập, hiện popup
                } else {
                  navigate('/cart'); // Nếu đã đăng nhập, chuyển đến trang giỏ hàng
                }
              }} 
              src={assets.basket_icon} 
              alt="" 
            />
            <div className={getTotalCartAmount()===0?"":"dot"} ></div>
         </div>
        {!token?<button onClick={()=>setShowLogin(true)}>Sign In</button>
        :<div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
               <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
               <hr />
               <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
         </div>}
        
     </div>
        </div>
  )
}

export default Navbar