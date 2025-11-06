import React , {useState} from 'react'
import './Home.css'
import Header from '../../component/Header/Header'
import ExploreMenu from '../../component/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../component/FoodDisplay/FoodDisplay'
import FoodItemDetail from '../FoodItemDetail/FoodItemDetail'

const Home = ({setShowLogin}) => {

  const [category,setCategory] = useState('All')
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);

  return (
    <div>
      <Header/>
      <ExploreMenu category={category} setCategory={setCategory}  />
      <FoodDisplay category={category} setShowLogin={setShowLogin} setSelectedFoodItem={setSelectedFoodItem}/>

      <FoodItemDetail 
        foodItem={selectedFoodItem} 
        onClose={() => setSelectedFoodItem(null)} 
      />
    </div>
  )
}

export default Home