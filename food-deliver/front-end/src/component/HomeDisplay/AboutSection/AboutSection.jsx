import React from 'react';
import './AboutSection.css'; 
import { Link, useNavigate } from 'react-router-dom';

import saladIcon from '../../../assets/home/salad.jpg';
import dish2 from '../../../assets/home/cake.jpeg';
import dish1 from '../../../assets/home/food.avif';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-title">
        <h1>SIMPLE <img src={saladIcon} alt="Salad"/> AND TASTY RECIPES</h1>
      </div>

      <div className="about-content">
        <div className="about-left">
          <img src={dish1} alt="Tasty dish" className="main-dish-img"/>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p>A restaurant is a business that prepares and serves food and drinks to customers. Meals are generally served and eaten on the premises</p>
          </div>
          <div className="about-explore">
            <button className="explore-btn" onClick={ () => window.location.href = '/menu' }>Explore Dishes</button>
          </div>
          <div className="about-small-dish">
            <img src={dish2} alt="Caprese salad"/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection;