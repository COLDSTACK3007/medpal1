import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Users, Video } from 'lucide-react';

// Import our new pages
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import Records from './pages/Records';
import Telemedicine from './pages/Telemedicine';

function App() {
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/symptom-checker", icon: <Stethoscope size={20} />, label: "Triage" },
    { to: "/records", icon: <Users size={20} />, label: "Records" },
    { to: "/telemedicine", icon: <Video size={20} />, label: "Telemed" },
  ];

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <nav className="sidebar">
        <div style={{ padding: '0 16px 32px' }}>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 800 }}>GramCare<span style={{ color: 'var(--text-main)' }}>AI</span></h1>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/records" element={<Records />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
        </Routes>
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="mobile-nav glass">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default App;
