import { useState, useEffect } from "react";
import '../App.css';
import { useNavigate } from "react-router-dom";
import { FiArrowUp, FiChevronRight, FiCheck, FiTrendingUp, FiShield, FiZap } from "react-icons/fi";

export default function Home() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetStarted = () => navigate("/upload");
  const handleJoinUs = () => navigate("/login");

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-container">
            <div className="hero-badge">AI-Powered Agriculture</div>
            <h1 className="hero-title">
              Revolutionizing <span className="gradient-text">Agriculture</span><br />
              with Artificial Intelligence
            </h1>
            <p className="hero-description">
              Empowering farmers through smart crop classification and early disease detection.
              Get accurate results in seconds with 95%+ accuracy.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleGetStarted}>
                Get Started <FiChevronRight />
              </button>
              <button className="btn-secondary" onClick={handleJoinUs}>
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">95%+</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Farmers Served</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">See It In Action</span>
            <h2>How Our AI Works</h2>
            <p>Watch this quick demo to understand the process</p>
          </div>
          <div className="video-wrapper">
            <video controls autoPlay muted loop>
              <source src="/Demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Choose Us</span>
            <h2>Powerful Features for Modern Farming</h2>
            <p>Everything you need to monitor and protect your crops</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiZap />
              </div>
              <h3>AI-Powered Analysis</h3>
              <p>Advanced deep learning algorithms provide accurate real-time crop disease detection with 95%+ accuracy.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiTrendingUp />
              </div>
              <h3>Instant Results</h3>
              <p>Upload crop images and get instant predictions with actionable insights and treatment recommendations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiShield />
              </div>
              <h3>Data Security</h3>
              <p>Your data is encrypted and secure. We prioritize privacy and confidentiality of all agricultural data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Farming?</h2>
            <p>Join thousands of farmers using Smart Agri Classifier</p>
            <button className="btn-primary" onClick={handleJoinUs}>
              Join Us Today <FiChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button 
        className={`scroll-top-btn ${showScrollTop ? 'show' : ''}`} 
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
}