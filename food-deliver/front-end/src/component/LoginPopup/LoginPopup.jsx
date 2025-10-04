import React, {useState} from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets';

const LoginPopup = ({setShowLogin}) => {

    const [currState, setCurrState] = useState("Sign Up"); // login, register, forgot password

  return (
    <div className='login-popup'>
        <form action="" className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className='login-popup-inputs'>
                {currState==="Login"?<></>: <input type="text" placeholder='Your Name' required/>}
                <input type="email" placeholder='Your Email' required />
                <input type="password" placeholder='Your password' required />
            </div>
            <button>{currState==="Sign Up"?"Create account":"Login"}</button>
            {currState === "Sign Up" && (
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>I agree to the Terms of Service and Privacy Policy</p>
                </div>
            )}
            {currState==="Login"
            ?<p>Create a new account? 
                <span onClick={()=>setCurrState("Sign Up")}> Click here</span></p>
            :<p>Already have an account? 
                <span onClick={()=>setCurrState("Login")}> Login here</span></p>}
            
        </form>
    </div>
  )
}

export default LoginPopup