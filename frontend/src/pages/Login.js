// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }           = useAuth();
  const navigate            = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="text-center fw-bold mb-1">Welcome back 👋</h2>
        <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
          Sign in to your account
        </p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control"
              value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2"
            disabled={loading} style={{ background: 'var(--primary)', border: 'none' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0" style={{ fontSize: '0.85rem' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
