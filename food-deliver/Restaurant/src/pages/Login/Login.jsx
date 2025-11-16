import React, { useState } from 'react';
import './Login.css';
import axios from "axios";
import { toast } from 'react-toastify';

const Login = ({ setIsLoggedIn }) => {

    const url = "http://localhost:4000";

    const [currState, setCurrState] = useState('Login');

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        address: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onLogin = async (event) => {
        event.preventDefault();

        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/restaurant/login"; 
        } else {
            newUrl += "/api/restaurant/register";
        }

        try {
            const response = await axios.post(newUrl, data);

            if (response.data.success) {
                const { token, role } = response.data;

                localStorage.setItem("token", token);

                // if (role) {
                //     localStorage.setItem("role", role);
                // }

                setIsLoggedIn(true);

                toast.success(currState === "Login" ? "Login Successful!" : "Registration Successful!");

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
        <div className='login'>
            <form onSubmit={onLogin} className="login-container">
                <div className="login-title">
                    <h2>{currState}</h2>
                    <span>Restaurant</span> 
                </div>
                <div className="login-inputs">
                    {
                        currState === "Login" ? <></> 
                        : 
                        <>
                        <input 
                            name='name'
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text" 
                            placeholder='Your Name' 
                            required />
                        <input 
                            name='address'
                            onChange={onChangeHandler}
                            value={data.address}
                            type="text" 
                            placeholder='Restaurant Address' 
                            required />
                        </>
                    }
                    <input 
                        name='email'
                        onChange={onChangeHandler} 
                        value={data.email} 
                        type="email" 
                        placeholder='Email' 
                        required 
                    />
                    <input 
                        name='password'
                        onChange={onChangeHandler} 
                        value={data.password} 
                        type="password" 
                        placeholder='Password' 
                        required 
                    />
                    
                </div>
                
                <button type='submit'>
                    {currState === "Sign Up" ? "Create Account" : "Log In"}
                </button>
                
                {currState === "Sign Up" && (
                    <div className="login-popup-condition">
                        <input type="checkbox" required />
                        <p>By Continuing, I agree to the terms of use and privacy policy.</p>
                    </div>
                )}
            
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default Login;