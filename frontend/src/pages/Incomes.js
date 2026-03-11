// src/pages/Incomes.js
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../utils/api';

const SOURCES = ['Salary', 'Freelancing', 'Business', 'Investment', 'Gift', 'Other'];
const EMPTY   = { amount: '', date: '', source: '', note: '' };

export default function Incomes() {
  const [incomes, setIncomes]   = useState([]);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [month, setMonth]       = useState('');

  const fetchIncomes = async () => {
    const params = month ? { month } : {};
    const res = await api.get('/incomes', { params });
    setIncomes(res.data);
  };

  useEffect(() => { fetchIncomes(); }, [month]);

  const openAdd = () => {
    setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) });
    setEditId(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (inc) => {
    setForm({ amount: inc.amount, date: inc.date.slice(0, 10), source: inc.source, note: inc.note || '' });
    setEditId(inc.id);
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income entry?')) return;
    await api.delete(`/incomes/${id}`);
    fetchIncomes();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      editId
        ? await api.put(`/incomes/${editId}`, form)
        : await api.post('/incomes', form);
      setShowModal(false);
      fetchIncomes();
    } catch (err) {
      const msgs = err.response?.data?.errors;
      setError(msgs ? Object.values(msgs).flat().join(' ') : 'Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) =>
   new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

  const totalIncome = incomes.reduce((s, i) => s + parseFloat(i.amount), 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Income</h4>
          {incomes.length > 0 && (
            <span className="text-success fw-bold" style={{ fontSize: '0.9rem' }}>
              Total: {fmt(totalIncome)}
            </span>
          )}
        </div>
        <button className="btn btn-success btn-sm px-3" onClick={openAdd}>
          + Add Income
        </button>
      </div>

      {/* Month filter */}
      <div className="d-flex gap-2 mb-3">
        <input type="month" className="form-control form-control-sm" style={{ width: '170px' }}
          value={month} onChange={(e) => setMonth(e.target.value)} />
        {month && (
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setMonth('')}>
            Clear
          </button>
        )}
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Date</th><th>Source</th><th>Amount</th><th>Note</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-muted py-4">No income records yet.</td></tr>
            ) : incomes.map((inc) => (
              <tr key={inc.id}>
                <td style={{ fontSize: '0.88rem' }}>{inc.date?.slice(0, 10)}</td>
                <td>
                  <span className="badge bg-success-subtle text-success fw-semibold"
                    style={{ background: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '99px' }}>
                    {inc.source}
                  </span>
                </td>
                <td className="fw-bold text-success">{fmt(inc.amount)}</td>
                <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{inc.note || '—'}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => openEdit(inc)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(inc.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem', fontWeight: 700 }}>
            {editId ? 'Edit Income' : 'Add Income'}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Amount ($)</label>
              <input type="number" step="0.01" min="0.01" className="form-control"
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Source</label>
              <select className="form-select" required
                value={form.source}
                onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}>
                <option value="">Select source…</option>
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="date" className="form-control"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Note (optional)</label>
              <input type="text" className="form-control" maxLength={255}
                placeholder="e.g. March salary"
                value={form.note}
                onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="success" size="sm" disabled={loading}>
              {loading ? 'Saving…' : editId ? 'Update' : 'Add Income'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
