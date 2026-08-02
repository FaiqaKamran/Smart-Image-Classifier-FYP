import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <footer className="pro-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-col brand-col">
            <h3>Smart Agri Classifier</h3>
            <p>
              Empowering farmers with AI-driven crop disease detection and smart agricultural solutions for a sustainable future.
            </p>
            <div className="footer-stats">
              <div><strong>95%</strong><span>Accuracy Rate</span></div>
              <div><strong>5000+</strong><span>Farmers Served</span></div>
              <div><strong>24/7</strong><span>Support Available</span></div>
            </div>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px', display: 'block' }}><Link to="/home">Home</Link></li>
              <li style={{ marginBottom: '12px', display: 'block' }}><Link to="/about">About Us</Link></li>
              <li style={{ marginBottom: '12px', display: 'block' }}><Link to="/upload">Upload Image</Link></li>
              <li style={{ marginBottom: '12px', display: 'block' }}><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Support</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px', display: 'block' }}><Link to="#">Help Center</Link></li>
              <li style={{ marginBottom: '12px', display: 'block' }}><Link to="#">Privacy Policy</Link></li>
              <li style={{ marginBottom: '12px', display: 'block' }}><Link to="#">Terms of Service</Link></li>
              <li style={{ marginBottom: '12px', display: 'block' }}><Link to="#">Contact Us</Link></li>
              <li style={{ marginBottom: '12px', display: 'block' }}><Link to="#">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact Info</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px', display: 'block' }}><a href="mailto:info@agrismart.com">info@agrismart.com</a></li>
              <li style={{ marginBottom: '12px', display: 'block' }}><a href="tel:+923001234567">+92 300 1234567</a></li>
              <li style={{ marginBottom: '12px', display: 'block' }}>Lahore, Pakistan</li>
            </ul>
            <div className="footer-social">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© {currentYear} Smart Agri Classifier. All rights reserved.</p>
            <div className="footer-links">
              <Link to="#">Sitemap</Link>
              <Link to="#">Accessibility</Link>
              <Link to="#">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}