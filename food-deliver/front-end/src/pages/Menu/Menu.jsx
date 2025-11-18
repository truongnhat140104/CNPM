import React , {useState} from 'react'
import './Menu.css'
import ExploreMenu from '../../component/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../component/FoodDisplay/FoodDisplay'
import FoodItemDetail from '../../component/FoodItemDetail/FoodItemDetail'

const Menu = ({setShowLogin}) => {

  const [category,setCategory] = useState('All')
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);

  return (
    <div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} setShowLogin={setShowLogin} setSelectedFoodItem={setSelectedFoodItem}/>

      <FoodItemDetail 
        foodItem={selectedFoodItem} 
        onClose={() => setSelectedFoodItem(null)} 
      />
    </div>
  )
}

export default Menu