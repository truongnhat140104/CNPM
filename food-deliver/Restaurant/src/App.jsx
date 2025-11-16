import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
// Import thêm Navigate
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
  
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <ToastContainer/>
      
      {!isLoggedIn ? (
        <Routes>
          {/* <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />   */}
          
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          
        </Routes>

      ) : (
        <>
          <Navbar />
          <hr />
          <div className='app-content'>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Navigate to='/user' />} />
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/update" element={<Update url={url} />} />
              <Route path="/account" element={<Account url={url} />} />
              <Route path="*" element={<Navigate to="/user" />} />      
            </Routes>
          </div>
        </>
      )}
    </div>
  )
}

export default App