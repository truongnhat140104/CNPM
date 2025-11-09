import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'

const App = () => {

  const url = "http://localhost:4000"

  return (
    <div>
      {/* <ToastContainer/> */}
      <Navbar />
      <hr />
      <div className='app-content'>
        <Sidebar />
        <Routes>
          {/* Define your restaurant routes here */}
        </Routes>
      </div>
    </div>
  )
}

export default App