import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import BoggleGame from './components/BoggleGame';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { useAppData } from './hooks/useAppData';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const { admins, children, adminFeedback } = useAppData();

  const handleLogin = (role, username) => {
    setUserRole(role);
    setUserData({ username });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 ">
      <div className="container mx-auto px-4 py-8">
        {!userRole ? (
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex items-center justify-center gap-4">
              <BookOpen size={48} className="text-blue-600" />
              <h1 className="text-5xl font-comic text-blue-600">
                Reading Adventure
              </h1>
            </div>
            
            <p className="text-2xl text-gray-700 font-comic leading-relaxed">
              Welcome to your special learning journey! 
              Let's make reading fun together.
            </p>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-comic mb-6 text-gray-800">
                Sign In to Continue
              </h2>
              <LoginForm onLogin={handleLogin} admins={admins} children={children} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto flex flex-col items-center space-y-8">
            {userRole === 'superadmin' && <SuperAdminDashboard adminFeedback={adminFeedback} />}
            {userRole === 'admin' && <AdminDashboard adminUsername={userData.username} />}
            {userRole === 'user' && <BoggleGame username={userData.username} />}
            <button
              onClick={() => {
                setUserRole(null);
                setUserData(null);
              }}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
