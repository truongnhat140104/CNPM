import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../context/StoreContext'

const FoodDisplay = ({category, setShowLogin}) => { 
    const {food_list} = useContext(StoreContext)
  return (
    <div className='food-display'>
        <div className="food-display-list">
            {food_list.map((item,index)=>{
              if (category==='All'|| item.category===category) {
                
                return <FoodItem 
                          key={index} 
                          id={item._id} 
                          name={item.name} 
                          price={item.price} 
                          description={item.description} 
                          image={item.image}
                          setShowLogin={setShowLogin}
                       /> 
              }
              
            })}
        </div>
    </div>
  )
}

export default FoodDisplay