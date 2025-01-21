import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Login from './components/Landing';
import AuthCallback from './components/Authcallback';
import Dashboard from './components/Dashboard';
import EventCreation from './components/EventCreation';
import EventDetail from './components/EventDetail';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import NotificationBell from './components/NotificationBell';
import Header from './components/Header';
import Chat from './components/Chat';

// PrivateRoute component to protect routes that require authentication
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

// AdminRoute component to protect routes that require admin access
const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && user.role === 'ADMIN' ? element : <Navigate to="/dashboard" />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Header />}
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/events/create" element={<PrivateRoute element={<EventCreation />} />} />
          <Route path="/events/:id" element={<PrivateRoute element={<EventDetail />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/admin" element={<AdminRoute element={<AdminPanel />} />} />
           <Route path="/chat/:recipientId" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;