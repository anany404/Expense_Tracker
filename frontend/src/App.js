// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import Expenses    from './pages/Expenses';
import Incomes     from './pages/Incomes';
import Categories  from './pages/Categories';
import Layout      from './components/Layout';

// Guard: redirect to /login if not authenticated
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index              element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"   element={<Dashboard />} />
            <Route path="expenses"    element={<Expenses />} />
            <Route path="incomes"     element={<Incomes />} />
            <Route path="categories"  element={<Categories />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
