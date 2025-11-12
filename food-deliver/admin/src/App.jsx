import React, { useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route, useNavigate  } from 'react-router-dom'
import List from './pages/List/List'
import Add from './pages/Add/Add'
import Orders from './pages/Orders/Orders'
import Update from './pages/Update/Update'
import User from './pages/User/User'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const TokenHandler = () => {

  const navigate = useNavigate();

  useEffect(() => {
    // 1. Lấy query string từ URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');

    if (token && role) {
      // 2. Lưu vào localStorage của 5174
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // 3. Xóa token khỏi URL để làm sạch, rồi điều hướng
      navigate('/user'); 
    }
  }, [navigate]);

  return null;
};

const App = () => {

  const url = "http://localhost:4000"

  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <hr />
      <div className='app-content'>
        <Sidebar />
        <Routes>
          <Route path="/" element={<TokenHandler />} />
          <Route path="/add" element={<Add url={url}/>} />
          <Route path="/list" element={<List url={url}/>} />
          <Route path="/orders" element={<Orders url={url}/>} />
          <Route path="/update" element={<Update url={url}/>} />
          <Route path="/user" element={<User url={url}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App