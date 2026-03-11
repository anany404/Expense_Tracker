// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 422) {
        // Laravel validation errors
        const raw = err.response.data.errors || {};
        setErrors(raw);
      } else {
        setErrors({ general: ['Registration failed. Please try again.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (name) =>
    errors[name] ? (
      <div className="text-danger" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
        {errors[name][0]}
      </div>
    ) : null;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="text-center fw-bold mb-1">Create account</h2>
        <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
          Start tracking your money today
        </p>

        {errors.general && (
          <div className="alert alert-danger py-2">{errors.general[0]}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control"
              value={form.name} onChange={handleChange} required />
            {fieldError('name')}
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control"
              value={form.email} onChange={handleChange} required />
            {fieldError('email')}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control"
              value={form.password} onChange={handleChange} required minLength={8} />
            {fieldError('password')}
          </div>
          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="password_confirmation" className="form-control"
              value={form.password_confirmation} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2"
            disabled={loading} style={{ background: 'var(--primary)', border: 'none' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0" style={{ fontSize: '0.85rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
