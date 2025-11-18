import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" className='footer-logo'/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti exercitationem sapiente veritatis qui distinctio. Impedit, labore sunt voluptatum sequi, cum facilis nemo ad rerum perspiciatis quod, magnam facere fuga. Provident.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
        </div>
        <hr />
        <p className="footer-copyright">Copyright 2023 Fast Food Delivery</p>
    </div>
  )
}

export default Footer