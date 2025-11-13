import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Update from './pages/Update/Update'
import Account from './pages/Account/Account'

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
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/update" element={<Update url={url} />} />
          <Route path="/account" element={<Account url={url} />} /> 
        </Routes>
      </div>
    </div>
  )
}

export default App