// src/pages/Expenses.js
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../utils/api';

const EMPTY = { amount: '', category_id: '', date: '', note: '' };

export default function Expenses() {
  const [expenses, setExpenses]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm]             = useState(EMPTY);
  const [editId, setEditId]         = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [filter, setFilter]         = useState({ month: '', category_id: '' });

  const fetchExpenses = async () => {
    const params = {};
    if (filter.month)       params.month       = filter.month;
    if (filter.category_id) params.category_id = filter.category_id;
    const res = await api.get('/expenses', { params });
    setExpenses(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => { fetchExpenses(); fetchCategories(); }, []);
  useEffect(() => { fetchExpenses(); }, [filter]);

  const openAdd = () => {
    setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) });
    setEditId(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (exp) => {
    setForm({
      amount:      exp.amount,
      category_id: exp.category_id,
      date:        exp.date.slice(0, 10),
      note:        exp.note || '',
    });
    setEditId(exp.id);
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) {
        await api.put(`/expenses/${editId}`, form);
      } else {
        await api.post('/expenses', form);
      }
      setShowModal(false);
      fetchExpenses();
    } catch (err) {
      const msgs = err.response?.data?.errors;
      setError(msgs ? Object.values(msgs).flat().join(' ') : 'Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

  const getCat = (id) => categories.find((c) => c.id === id);

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Expenses</h4>
        <button className="btn btn-primary btn-sm px-3" onClick={openAdd}
          style={{ background: 'var(--primary)', border: 'none' }}>
          + Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <input type="month" className="form-control form-control-sm" style={{ width: '170px' }}
          value={filter.month}
          onChange={(e) => setFilter((p) => ({ ...p, month: e.target.value }))} />
        <select className="form-select form-select-sm" style={{ width: '180px' }}
          value={filter.category_id}
          onChange={(e) => setFilter((p) => ({ ...p, category_id: e.target.value }))}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
        {(filter.month || filter.category_id) && (
          <button className="btn btn-sm btn-outline-secondary"
            onClick={() => setFilter({ month: '', category_id: '' })}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Date</th><th>Category</th><th>Amount</th><th>Note</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-muted py-4">No expenses found.</td></tr>
            ) : expenses.map((exp) => {
              const cat = exp.category || getCat(exp.category_id);
              return (
                <tr key={exp.id}>
                  <td style={{ fontSize: '0.88rem' }}>{exp.date?.slice(0, 10)}</td>
                  <td>
                    {cat && (
                      <span className="cat-badge" style={{ background: cat.color }}>
                        {cat.icon} {cat.name}
                      </span>
                    )}
                  </td>
                  <td className="fw-bold text-danger">{fmt(exp.amount)}</td>
                  <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{exp.note || '—'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => openEdit(exp)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(exp.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem', fontWeight: 700 }}>
            {editId ? 'Edit Expense' : 'Add Expense'}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="mb-3">
              <label className="form-label">Amount ($)</label>
              <input type="number" step="0.01" min="0.01" className="form-control"
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                required />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" required
                value={form.category_id}
                onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}>
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="date" className="form-control"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                required />
            </div>
            <div className="mb-2">
              <label className="form-label">Note (optional)</label>
              <input type="text" className="form-control" maxLength={255}
                placeholder="e.g. Lunch with team"
                value={form.note}
                onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading}
              style={{ background: 'var(--primary)', border: 'none' }}>
              {loading ? 'Saving…' : editId ? 'Update' : 'Add Expense'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
