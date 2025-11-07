import React from 'react'
import Navbar from './component/Navbar/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Home from './pages/Home/Home'
import Footer from './component/Footer/Footer'
import LoginPopup from './component/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import { ToastContainer } from 'react-toastify'
import FoodItemDetail from './component/FoodItemDetail/FoodItemDetail'
  
const App = () => {
  const [showLogin,setShowLogin] = React.useState(false);
  return (
    <>  
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <ToastContainer />
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<Home setShowLogin={setShowLogin}/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={<PlaceOrder/>}/>
        <Route path='/verify' element={<Verify/>}/>
        <Route path='/myorders' element={<MyOrders/>}/>
        <Route path='/food/:id' element={<FoodItemDetail/>}/> 
      </Routes>
    </div>
      <Footer/>
    </>
  )
}

export default App
