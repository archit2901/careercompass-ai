import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SkillsInventory from './SkillsInventory';
import { JobAnalyzer } from '../Analysis';

const DashboardHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🧭 CareerCompass AI</h1>
          <div className="user-menu">
            <span className="user-greeting">Hello, {user?.name || 'User'}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome to Your Career Dashboard</h2>
          <p>Your AI-powered career development companion</p>
        </div>

        {/* Skills Inventory Section */}
        <SkillsInventory />

        {/* Job Analyzer Section */}
        <div style={{ marginTop: '2rem' }}>
          <JobAnalyzer />
        </div>

        <div className="features-grid" style={{ marginTop: '2rem' }}>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Learning Path</h3>
            <p>Get personalized learning recommendations</p>
            <span className="coming-soon">Coming Soon</span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Interview Prep</h3>
            <p>Practice with AI-generated interview questions</p>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;