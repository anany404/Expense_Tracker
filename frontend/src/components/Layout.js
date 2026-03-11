// src/components/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard',  icon: '📊', label: 'Dashboard'  },
  { to: '/expenses',   icon: '💸', label: 'Expenses'   },
  { to: '/incomes',    icon: '💰', label: 'Income'     },
  { to: '/categories', icon: '🏷️',  label: 'Categories' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // auto close if screen becomes large (≥992) or user presses Escape
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) setSidebarOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  return (
    <div>
      {/* Mobile/tablet header (hidden on large) */}
      <header className="mobile-header d-lg-none">
        <button className="mobile-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
          ☰
        </button>
        <div className="brand">💼 ExpenseTracker</div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <div className="brand d-none d-md-block">💼 ExpenseTracker</div>
          {sidebarOpen && (
            <button className="btn-close d-lg-none" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />
          )}
        </div>
        <nav className="mt-2">
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setSidebarOpen(false)}>
              <span>{icon}</span> {label}
            </NavLink>
          ))}
        </nav>

        <div className="logout-btn">
          <div style={{ fontSize: '0.8rem', marginBottom: '10px', opacity: 0.7 }}>
            👤 {user?.name}
          </div>
          <button className="btn btn-sm btn-outline-light w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* overlay to close sidebar when open on mobile */}
      {sidebarOpen && <div className="sidebar-backdrop d-lg-none" onClick={toggleSidebar} />}
    </div>
  );
}
