import React, { useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route, useNavigate  } from 'react-router-dom'
import User from './pages/User/User'
import AddingRes from './pages/AddingRes/AddingRes'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const TokenHandler = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');

    if (token && role) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

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
      {/* <hr /> */}
      <div className='app-container'>
        <div className='main-layout'>
          <div className="left-column">
            <Sidebar />
          </div>
          <div className='right-content'>
            <Routes>
              <Route path="/" element={<TokenHandler />} />
              <Route path="/user" element={<User url={url}/>} />
              <Route path="/addingres" element={<AddingRes url={url}/>} />
            </Routes>
          </div>

        </div>
        
      </div>
    </div>
  )
}

export default App