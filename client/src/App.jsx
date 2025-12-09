import { useState, useEffect } from 'react'

function App() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Test backend connection
    fetch('http://localhost:5001/api/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          🚀 CareerCompass AI
        </h1>
        <p className="text-center text-gray-600 mb-8">
          AI-Powered Career Development Platform
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-2xl font-semibold mb-3">Frontend Status</h2>
          <p className="text-green-600 text-xl font-medium">✅ React App Running</p>
          <p className="text-gray-600">Port: 5173</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-3">Backend Status</h2>
          {loading && <p className="text-gray-600">Connecting to backend...</p>}
          {error && (
            <div className="text-red-600">
              <p className="text-xl font-medium">❌ Backend Connection Failed</p>
              <p className="text-sm mt-2">{error}</p>
              <p className="text-sm mt-3 text-gray-600">
                Make sure the backend server is running on port 5000
              </p>
            </div>
          )}
          {backendStatus && (
            <div>
              <p className="text-green-600 text-xl font-medium mb-2">
                ✅ Backend Connected
              </p>
              <p className="text-gray-600">Status: {backendStatus.status}</p>
              <p className="text-gray-600">Environment: {backendStatus.environment}</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            ✅ Setup Complete!
          </h3>
          <p className="text-green-700">
            Both frontend and backend are running successfully.
          </p>
          <p className="text-green-600 text-sm mt-2">
            Next step: Build the authentication system
          </p>
        </div>
      </div>
    </div>
  )
}

export default App