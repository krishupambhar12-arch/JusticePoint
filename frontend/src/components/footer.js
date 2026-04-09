import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Justice Point</h3>
          <p className="footer-description">
            Your trusted platform for connecting with the best legal professionals. 
            Book appointments, get legal advice, and resolve your legal matters efficiently.
          </p>
          <div className="social-icons">
            <a href="https://www.facebook.com/" className="social-icon facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://x.com/" className="social-icon twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/" className="social-icon linkedin">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.instagram.com/" className="social-icon instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/" className="social-icon youtube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/attorneys">Find a Lawyer</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Legal</h3>
          <ul className="footer-links">
            <li><Link to="/our-rights">Our Rights</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/cookies">Cookie Policy</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
            <li><Link to="/ai-advisor">AI Advisor</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Info</h3>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>17th Floor, One ICC, Shanghai ICC, 999 Middle Huai Hai Road, Xuhui District, Shanghai, 200031.</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>+86 21 2412 6000</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>justicepoint@gmail.com</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock"></i>
              <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 Justice Point. All Rights Reserved. | Your Justice, Our Responsibility</p>
      </div>
    </footer>
  );
};

export default Footer;
