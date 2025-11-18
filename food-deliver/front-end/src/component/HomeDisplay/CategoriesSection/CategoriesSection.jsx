import React from 'react';
import './CategoriesSection.css';

import categoryDish1 from '../../../assets/home/salad.jpg';
import categoryDish2 from '../../../assets/home/fastfood.jpg';
import categoryDish3 from '../../../assets/home/maincourse.webp';
import arrowIcon from '../../../assets/home/arrow.png';

const CategoriesSection = () => {
  return (
    <section className="categories-section">
      <div className="categories-header">
        <div className="categories-title-group">
          <h2 className="section-title">OUR CATEGORIES</h2>
        </div>
        <p className="section-description">
          All grilled to perfection
          <br />
          over charcoal our dips
          <br />
          and sauces
        </p>
      </div>

      <div className="category-image-wrapper image-left">
        <div className="image-bg-circle green"></div>
        <img src={categoryDish1} alt="Pasta salad" className="category-image" />
      </div>

      <div className="category-list">
        <div className="category-item">
          <span>Main course</span>
          <img src={arrowIcon} alt="explore"/>
        </div>
        <div className="category-item">
          <span>Fast food</span>
          <img src={arrowIcon} alt="explore"/>
        </div>
        <div className="category-item">
          <span>Dessert</span>
          <img src={arrowIcon} alt="explore"/>
        </div>
        <div className="category-item">
          <span>Drinks</span>
          <img src={arrowIcon} alt="explore"/>
        </div>
        <div className="category-item">
          <span>Bakery</span>
          <img src={arrowIcon} alt="explore"/>
        </div>
      </div>

      <div className="category-image-wrapper image-right">
        <div className="image-bg-circle orange"></div>
        <img src={categoryDish2} alt="Caesar salad" className="category-image" />
      </div>

      <p className="footer-text">
        We understand that every event is unique, and we work closely with you
        to customize our catering menu to suit your specific needs
      </p>

      <div className="category-image-wrapper image-bottom">
        <div className="image-bg-circle beige"></div>
        <img src={categoryDish3} alt="Rice dish" className="category-image" />
      </div>

      <button className="explore-btn-round" onClick={ () => window.location.href = '/menu' }>
        Explore
        <br />
        More
      </button>

    </section>
  );
}

export default CategoriesSection;