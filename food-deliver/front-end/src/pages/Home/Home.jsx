import React , {useState} from 'react'
import './Home.css'
import Header from '../../component/Header/Header'
import AboutSection from '../../component/HomeDisplay/AboutSection/AboutSection'
import ExperienceSection from '../../component/HomeDisplay/ExperienceSection/ExperienceSection'
import CategoriesSection from '../../component/HomeDisplay/CategoriesSection/CategoriesSection'

const Home = ({setShowLogin}) => {
  return (
    <div>
      <Header/>
      <AboutSection />
      <ExperienceSection />
      <CategoriesSection />
    </div>
  )
}
export default Home