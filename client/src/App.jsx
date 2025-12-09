import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login, Register, ProtectedRoute } from './components/Auth';
import { DashboardHome } from './components/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardHome />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect root to dashboard (will redirect to login if not authenticated) */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 catch-all */}
            <Route
              path="*"
              element={
                <div className="not-found">
                  <h1>404</h1>
                  <p>Page not found</p>
                  <a href="/">Go Home</a>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;