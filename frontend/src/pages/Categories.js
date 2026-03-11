// src/pages/Categories.js
import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const COLORS = ['#f59e0b','#ef4444','#3b82f6','#10b981','#8b5cf6','#06b6d4','#f97316','#84cc16'];
const ICONS  = ['📁','🍔','✈️','💡','🛍️','💊','📚','🎮','🚗','🏠','💼','🎵'];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm]             = useState({ name: '', color: '#6366f1', icon: '📁' });
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/categories', form);
      setForm({ name: '', color: '#6366f1', icon: '📁' });
      setSuccess('Category added!');
      fetchCategories();
    } catch (err) {
      setError('Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete a predefined category.');
    }
  };

  const predefined = categories.filter((c) => c.user_id === null);
  const custom     = categories.filter((c) => c.user_id !== null);

  const CategoryBadge = ({ cat, onDelete }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px',
      borderRadius: '10px',
      background: '#fff',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 14px',
        borderRadius: '99px',
        background: cat.color,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.85rem',
        letterSpacing: '0.3px',
        boxShadow: `0 2px 8px ${cat.color}55`,
      }}>
        {cat.name}
      </span>
      {onDelete ? (
        <button onClick={() => onDelete(cat.id)}
          style={{
            background: '#fee2e2', border: 'none', borderRadius: '6px',
            color: '#ef4444', cursor: 'pointer', padding: '4px 10px',
            fontSize: '0.78rem', fontWeight: 600,
          }}>
          Delete
        </button>
      ) : (
        <span style={{
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px',
          padding: '3px 10px', borderRadius: '99px',
          background: cat.color + '20', color: cat.color,
        }}>
          BUILT-IN
        </span>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px' }}>
      <h4 className="fw-bold mb-4">Categories</h4>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* ── Add custom category ── */}
        <div style={{
          background: '#fff', borderRadius: '14px',
          padding: '24px', border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <h6 className="fw-bold mb-3">➕ Create Custom Category</h6>

          {error   && <div className="alert alert-danger  py-2 mb-3">{error}</div>}
          {success && <div className="alert alert-success py-2 mb-3">{success}</div>}

          <form onSubmit={handleAdd}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" maxLength={100} required
                placeholder="e.g. Gym"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>

            <div className="mb-3">
              <label className="form-label">Icon</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ICONS.map((ic) => (
                  <button key={ic} type="button"
                    onClick={() => setForm((p) => ({ ...p, icon: ic }))}
                    style={{
                      width: '38px', height: '38px', borderRadius: '8px',
                      fontSize: '1.1rem', cursor: 'pointer',
                      border: form.icon === ic ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                      background: form.icon === ic ? '#ede9fe' : '#f8fafc',
                    }}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {COLORS.map((col) => (
                  <button key={col} type="button"
                    onClick={() => setForm((p) => ({ ...p, color: col }))}
                    style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: col, cursor: 'pointer',
                      border: form.color === col ? '3px solid #1e1b4b' : '2px solid transparent',
                      outline: form.color === col ? `2px solid ${col}` : 'none',
                    }} />
                ))}
                <input type="color" value={form.color}
                  onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 }} />
              </div>

              {/* Preview */}
              {form.name && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>Preview:</div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '5px 14px', borderRadius: '99px',
                    background: form.color, color: '#fff',
                    fontWeight: 700, fontSize: '0.85rem',
                    boxShadow: `0 2px 8px ${form.color}55`,
                  }}>
                    {form.icon} {form.name}
                  </span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px',
                background: 'var(--primary)', color: '#fff',
                border: 'none', fontWeight: 700, cursor: 'pointer',
                fontSize: '0.9rem',
              }}>
              {loading ? 'Adding…' : '+ Add Category'}
            </button>
          </form>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Predefined */}
          <div style={{
            background: '#fff', borderRadius: '14px',
            padding: '24px', border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <h6 className="fw-bold mb-3">🏷️ Predefined Categories</h6>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {predefined.map((cat) => (
                <CategoryBadge key={cat.id} cat={cat} />
              ))}
            </div>
          </div>

          {/* Custom */}
          {custom.length > 0 && (
            <div style={{
              background: '#fff', borderRadius: '14px',
              padding: '24px', border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <h6 className="fw-bold mb-3">✨ My Custom Categories</h6>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                {custom.map((cat) => (
                  <CategoryBadge key={cat.id} cat={cat} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}