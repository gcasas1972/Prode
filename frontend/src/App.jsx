import React, { useState } from 'react';
import { Register, Login } from './Auth';
import { Matches } from './Matches';
import { Ranking } from './Ranking';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });
  const [activeTab, setActiveTab] = useState('matches');
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab('matches');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setShowLogin(true);
    setActiveTab('matches');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>⚽ PRODE Mundial 2026</h1>
          </div>
          <nav className="nav">
            {currentUser ? (
              <div className="user-nav">
                <span className="user-name">¡Hola, {currentUser.username}!</span>
                <span className="user-points">Puntos: {currentUser.points}</span>
                <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
              </div>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="main">
        {!currentUser ? (
          <div className="auth-section">
            <div className="auth-toggle">
              <button 
                className={showLogin ? 'active' : ''}
                onClick={() => setShowLogin(true)}
              >
                Iniciar Sesión
              </button>
              <button 
                className={!showLogin ? 'active' : ''}
                onClick={() => setShowLogin(false)}
              >
                Registrarse
              </button>
            </div>
            {showLogin ? (
              <Login onSuccess={handleLogin} />
            ) : (
              <Register onSuccess={() => setShowLogin(true)} />
            )}
          </div>
        ) : (
          <div className="app-content">
            <nav className="tabs">
              <button
                className={activeTab === 'matches' ? 'active' : ''}
                onClick={() => setActiveTab('matches')}
              >
                Partidos
              </button>
              <button
                className={activeTab === 'ranking' ? 'active' : ''}
                onClick={() => setActiveTab('ranking')}
              >
                Ranking
              </button>
            </nav>

            <div className="tab-content">
              {activeTab === 'matches' && <Matches userId={currentUser.id} />}
              {activeTab === 'ranking' && <Ranking />}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>PRODE © 2026 - Tu aplicación de pronósticos del Mundial</p>
      </footer>
    </div>
  );
}
