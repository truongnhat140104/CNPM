import React, { useState, useContext} from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios"
import { toast } from 'react-toastify';

const LoginPopup = ({setShowLogin}) => {

    const {url,setToken, setRole} = useContext(StoreContext)
    const urlAdmin = "http://localhost:5174";
    const urlOwner = "http://localhost:5175";

    const [currState,setCurrState] = useState('Login');
    const [data,setData] = useState({
        name:"",
        email:"",
        password:""
    })

    const onChangHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }

    const onLogin = async (event) => {
        event.preventDefault();
        
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {
            const response = await axios.post(newUrl, data);

            if (response.data.success) {
                const { token, role } = response.data;
                setToken(token);
                setRole(role);
                localStorage.setItem("token", token);
                localStorage.setItem("role", role);
                setShowLogin(false);
                toast.success(currState === "Login" ? "Login Successful!" : "Registration Successful!");

                // Dựa vào role để chuyển trang
                if (role === 'admin') {
                    window.location.href = `${urlAdmin}/?token=${token}&role=${role}`;
                } else if (role === 'owner') {
                    window.location.href = `${urlOwner}/?token=${token}&role=${role}`;
                }
                // (Nếu là customer thì không cần làm gì, popup tự đóng)

            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    }

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=> setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
                {
                    currState==="Login"?<></> :<input type="text" name='name' onChange={onChangHandler} value={data.name} placeholder='Your Name' required/>
                }
                
                <input type="email" name='email' onChange={onChangHandler} value={data.email} placeholder='Your Email' required/>
                <input type="password" name='password' onChange={onChangHandler} value={data.password} placeholder='Your Password' required/>
            </div>
            <button type='submit'>{currState==="Sign Up"?"Create Account":"Login"}</button>
            {currState === "Sign Up" && (
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By Continuing, i agree the terms of use and privacy policy.</p>
                </div>
            )}
            
            {currState==="Login"
            ?<p>Create a new account? <span onClick={()=> setCurrState('Sign Up')}>Click here</span></p>
            :<p>Already have an account? <span onClick={()=> setCurrState('Login')}>Login here</span></p>}
            
        </form>
    </div>
  )
}

export default LoginPopup