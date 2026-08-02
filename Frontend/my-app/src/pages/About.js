import { useState, useEffect } from "react";
import { FiArrowUp, FiTarget, FiEye, FiHeart, FiCpu } from "react-icons/fi";

export default function About() {
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

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <div className="container">
            <span className="hero-badge">About Us</span>
            <h1>Smart <span className="gradient-text">Agri</span> Classifier</h1>
            <p>
              An innovative AI-powered platform transforming Pakistan's agricultural sector
              through smart crop classification and early disease detection.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Combined */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon"><FiTarget /></div>
              <h3>Our Mission</h3>
              <p>
                To empower farmers with affordable AI technology that provides early
                disease detection, reducing crop losses and improving agricultural efficiency
                across Pakistan.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon"><FiEye /></div>
              <h3>Our Vision</h3>
              <p>
                A future where every farmer has access to smart agricultural tools,
                creating a sustainable and technology-driven farming ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-showcase">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>5000+</h3>
              <p>Farmers Reached</p>
            </div>
            <div className="stat-card">
              <h3>95%</h3>
              <p>Accuracy Rate</p>
            </div>
            <div className="stat-card">
              <h3>24/7</h3>
              <p>Support Available</p>
            </div>
            <div className="stat-card">
              <h3>50+</h3>
              <p>Crop Types</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Core Values</span>
            <h2>What Drives Us</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><FiHeart /></div>
              <h3>Innovation</h3>
              <p>Continuously exploring new technologies for better solutions</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FiHeart /></div>
              <h3>Sustainability</h3>
              <p>Promoting eco-friendly and sustainable farming practices</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FiHeart /></div>
              <h3>Accessibility</h3>
              <p>Making technology accessible to all farmers</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FiHeart /></div>
              <h3>Accuracy</h3>
              <p>Delivering precise and reliable predictions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Technology</span>
            <h2>Our Tech Stack</h2>
          </div>
          <div className="tech-grid">
            <div className="tech-item"><FiCpu /> React.js</div>
            <div className="tech-item"><FiCpu /> Node.js</div>
            <div className="tech-item"><FiCpu /> MongoDB</div>
            <div className="tech-item"><FiCpu /> Python</div>
            <div className="tech-item"><FiCpu /> Flask</div>
            <div className="tech-item"><FiCpu /> OpenCV</div>
          </div>
        </div>
      </section>

      <button 
        className={`scroll-top-btn ${showScrollTop ? 'show' : ''}`} 
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
}