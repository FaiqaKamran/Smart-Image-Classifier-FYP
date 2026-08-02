import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function Dashboard() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [stats, setStats] = useState({
    totalUploads: 0,
    healthyCrops: 0,
    diseaseDetected: 0,
    accuracy: 0,
    pendingReviews: 0
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    loadDashboardData();
    
    window.addEventListener('newUploadAdded', loadDashboardData);
    window.addEventListener('storage', loadDashboardData);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('newUploadAdded', loadDashboardData);
      window.removeEventListener('storage', loadDashboardData);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadDashboardData = () => {
    const savedUploads = localStorage.getItem('cropUploads');
    const allUploads = savedUploads ? JSON.parse(savedUploads) : [];
    const totalUploads = allUploads.length;
    const healthyCrops = allUploads.filter(upload => upload.status === "Healthy").length;
    const diseaseDetected = allUploads.filter(upload => upload.status !== "Healthy").length;
    
    // Calculate average accuracy
    let totalAccuracy = 0;
    let accuracyCount = 0;
    allUploads.forEach(upload => {
      if (upload.confidence) {
        const conf = parseFloat(upload.confidence);
        if (!isNaN(conf)) {
          totalAccuracy += conf;
          accuracyCount++;
        }
      }
    });
    const avgAccuracy = accuracyCount > 0 ? Math.round(totalAccuracy / accuracyCount) : 0;
    
    setStats({
      totalUploads: totalUploads,
      healthyCrops: healthyCrops,
      diseaseDetected: diseaseDetected,
      accuracy: avgAccuracy,
      pendingReviews: allUploads.filter(upload => !upload.reviewed).length
    });
    
    const recentUploads = [...allUploads]
      .sort((a, b) => {
        // Sort by date and time
        const dateA = new Date(a.date + ' ' + (a.time || ''));
        const dateB = new Date(b.date + ' ' + (b.time || ''));
        return dateB - dateA;
      })
      .slice(0, 10);
    setRecent(recentUploads);
  };

  const getStatusBadge = (status) => {
    if (status?.toLowerCase().includes("healthy")) {
      return <span className="badge-success"> {status}</span>;
    } else if (status?.toLowerCase().includes("disease")) {
      return <span className="badge-warning"> {status}</span>;
    } else {
      return <span className="badge-warning"> {status}</span>;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1> Dashboard</h1>
          <p>Monitor your crop health analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalUploads}</h3>
            <p>Total Uploads</p>
          </div>
          <div className="stat-card">
            <h3>{stats.healthyCrops}</h3>
            <p> Healthy Crops</p>
          </div>
          <div className="stat-card">
            <h3>{stats.diseaseDetected}</h3>
            <p> Diseased Crops</p>
          </div>
          <div className="stat-card">
            <h3>{stats.accuracy}%</h3>
            <p> Accuracy</p>
          </div>
        </div>

        {/* Recent Uploads Table */}
        <div className="recent-section">
          <h2> Recent Uploads</h2>
          {recent.length === 0 ? (
            <div className="empty-state">
              <p>No uploads yet. Go to <a href="/upload" style={{color: '#2563eb', fontWeight: 'bold'}}>Upload</a> page to get started!</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Crop</th>
                  <th>Status</th>
                  <th>Confidence</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td> {item.crop}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>{item.confidence || 'N/A'}</td>
                    <td>{item.date}</td>
                    <td>{item.time || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <button 
        className={`scroll-top-btn ${showScrollTop ? 'show' : ''}`} 
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
}