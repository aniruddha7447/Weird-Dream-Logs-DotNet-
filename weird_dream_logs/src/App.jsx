import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './styles/Navbar.css'
import Home from './components/Home.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Dashboard from './components/Dashboard.jsx'
import Profile from './components/Profile.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import UserProfile from './components/UserProfile.jsx'
import { useAuth } from './contexts/AuthContext'
import FollowersSection from './components/FollowersSection.jsx'

function Navbar({ user, logout }) {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">WeirdDreamLogs</span>
        <Link to="/" className={`navbar-link${location.pathname === '/' ? ' active' : ''}`}>Dashboard</Link>
        <Link to="/profile" className={`navbar-link${location.pathname === '/profile' ? ' active' : ''}`}>Profile</Link>
        {user.role !== 'Admin' && <Link to="/followers" className={`navbar-link${location.pathname === '/followers' ? ' active' : ''}`}>Followers</Link>}
        {user.role === 'Admin' && <Link to="/admin" className={`navbar-link${location.pathname === '/admin' ? ' active' : ''}`}>Admin</Link>}
      </div>
      <button className="navbar-logout" onClick={logout}>Logout</button>
    </nav>
  );
}

function App() {
  const { user, login, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

    return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!user ? <Home /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login onLogin={(user) => login(user, localStorage.getItem('token'))} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register onRegister={() => {}} /> : <Navigate to="/dashboard" />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={user ? (
          <>
            <Navbar user={user} logout={logout} />
            <Dashboard user={user} />
          </>
        ) : <Navigate to="/login" />} />
        
        <Route path="/profile" element={user ? (
          <>
            <Navbar user={user} logout={logout} />
            <Profile user={user} onUpdate={() => {}} />
          </>
        ) : <Navigate to="/login" />} />
        
        <Route path="/followers" element={user ? (
          <>
            <Navbar user={user} logout={logout} />
            <FollowersSection user={user} />
          </>
        ) : <Navigate to="/login" />} />
        
        <Route path="/admin" element={user && user.role === 'Admin' ? (
          <>
            <Navbar user={user} logout={logout} />
            <AdminDashboard user={user} />
          </>
        ) : <Navigate to="/dashboard" />} />
        
        <Route path="/user/:id" element={user ? (
          <>
      <Navbar user={user} logout={logout} />
            <UserProfile userId={user.id} currentUser={user} />
          </>
        ) : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
