
import React from 'react';
import './ExperienceSection.css';

import mainDish from '../../../assets/home/hamburger.webp';
import smallDishIcon from '../../../assets/home/nuget.jpg';
import kebabIcon from '../../../assets/home/kebab.jpeg';

const ExperienceSection = () => {
  return (
    <section className="experience-section">
      <div className="experience-left">
        <div className="experience-title">
          <h2>EXPERIENCE OF REAL RECIPES TASTE <img src={smallDishIcon} alt="Dish"/></h2>
        </div>
        <div className="experience-text">
          <img src={kebabIcon} alt="Kebab"/>
          <p>But our menu doesn't stop at breakfast. We also offer a wide range of kebab plates.</p>
        </div>
        <a href="/menu" className="view-all-link">VIEW ALL</a>
      </div>
      
      <div className="experience-right">
        <img src={mainDish} alt="Experience dish" className="experience-dish-img"/>
      </div>
    </section>
  );
}

export default ExperienceSection;