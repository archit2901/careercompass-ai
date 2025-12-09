import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Skills Inventory</h3>
            <p>Track and manage your professional skills</p>
            <span className="coming-soon">Coming Soon</span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Job Analysis</h3>
            <p>Analyze job descriptions and identify skill gaps</p>
            <span className="coming-soon">Coming Soon</span>
          </div>

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

        <div className="user-info-card">
          <h3>Your Profile</h3>
          <div className="profile-details">
            <div className="profile-item">
              <span className="label">Name:</span>
              <span className="value">{user?.name}</span>
            </div>
            <div className="profile-item">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="profile-item">
              <span className="label">Member since:</span>
              <span className="value">
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;