import React, {useContext, useState} from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const Navbar = ({setShowLogin}) => {

    const [menu,setMenu] = useState("home");

    const {getTotalCartAmount,token,setToken} = useContext(StoreContext);

    const navigate = useNavigate();
    const logout = () => {
      toast.success("Logged out successfully!");
      localStorage.removeItem("token");
      setToken("");
      navigate("/");
    }

  return (
    <div className='navbar'>
     <Link to='/home'><img src={assets.logo} alt="" className='logo'/></Link>
     <ul className="navbar-menu">
        <Link to='/home' onClick={()=>setMenu("home")} className={menu === "home" ? "active" : ""} >Home</Link>
        <Link to="/menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</Link>
     </ul>
     <div className="navbar-right">
        <img src={assets.search_icon} alt="" className='search-icon' />
        
        <div className="navbar-search-icon">
            <img 
              onClick={() => {
                if (!token) {
                  toast.info("Please sign in to view your cart.");
                  setShowLogin(true);
                } else {
                  navigate('/yourcart'); 
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