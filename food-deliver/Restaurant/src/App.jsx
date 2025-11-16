import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom' 
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Update from './pages/Update/Update'
import Account from './pages/Account/Account'
import Login from './pages/Login/Login';

const App = () => {
  const url = "http://localhost:4000"
  
  const [isLoggedIn, setIsLoggedIn] = React.useState(localStorage.getItem("token") ? true : false);

  return (
    <div>
      <ToastContainer/>
      <Routes>
        {!isLoggedIn && (
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        )}
        
        {!isLoggedIn && (
          <Route path="/*" element={<Navigate to='/login' />} />
        )}

        {isLoggedIn && (
          <Route path="/*" element={
            <>
              <Navbar setIsLoggedIn={setIsLoggedIn} /> 
              <hr />
              <div className='app-content'>
                <Sidebar setIsLoggedIn={setIsLoggedIn} />
                <Routes>
                  <Route path="/login" element={<Navigate to='/account' />} /> 
                  
                  {/* Trang mặc định */}
                  <Route path="/" element={<Navigate to='/account' />} /> 
                  
                  <Route path="/add" element={<Add url={url} />} />
                  <Route path="/list" element={<List url={url} />} />
                  <Route path="/update" element={<Update url={url} />} />
                  <Route path="/account" element={<Account url={url} />} />
                  
                  <Route path="/orders" element={<Orders url={url} />} />
                  
                  {/* Bất kỳ route lạ nào khác sẽ về /account */}
                  <Route path="*" element={<Navigate to="/account" />} />      
                </Routes>
              </div>
            </>
          } />
        )}
        
      </Routes>
    </div>
  )
}

export default App