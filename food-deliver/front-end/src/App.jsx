import React, { useState } from 'react'
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
// import RegisRes from './pages/RegisRes/RegisRes.jsx'
import Menu from './pages/Menu/Menu.jsx'

import YourCart from './pages/YourCart/YourCart.jsx'

const App = () => {
  const [showLogin,setShowLogin] = React.useState(false);
  const [category,setCategory] = useState('All')
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);

  return (
    <>  
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <ToastContainer />
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='*' element={<Home setShowLogin={setShowLogin}/>}/>
        <Route path='/home' element={<Home setShowLogin={setShowLogin}/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={<PlaceOrder/>}/>
        <Route path='/verify' element={<Verify/>}/>
        <Route path='/myorders' element={<MyOrders/>}/>
        <Route path='/food/:id' element={<FoodItemDetail/>}/> 
        {/* <Route path='/regisRes' element={<RegisRes/>}/>  */}
        <Route path='/menu' element={<Menu setShowLogin={setShowLogin}/>}/>
        <Route path='/yourcart' element={<YourCart/>}/>
      </Routes>
    </div>
      <Footer/>
    </>
  )
}

export default App
