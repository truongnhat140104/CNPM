import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
              <img src={assets.logo} alt="logo" />
              <p>lkasjdlkasdasdlkaslkdjlk</p>
              <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="facebook_icon" />
                <img src={assets.linkedin_icon} alt="linkedin_icon" />
                <img src={assets.twitter_icon} alt="twitter_icon" />
              </div>
            </div> 
            <div className="footer-content-center">
              <h2>Company</h2>
              <ul>
                <li>About us</li>
                <li>Our services</li>
                <li>Privacy policy</li>
              </ul>
            </div>
            <div className="footer-content-right">
              <h2>GET IN TOUCH</h2>
              <ul>
                <li>Contact us</li>
                <li>Support</li>
              </ul>
            </div>
        </div>
        <hr />
        <p className='footer-copy-right'>
          &copy; 2024 Food Delivery. All rights reserved.
        </p>
    </div>
  )
}

export default Footer