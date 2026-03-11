// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user }  = useAuth();
  const [data, setData]     = useState(null);
  const [month, setMonth]   = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const params = month ? { month } : {};
      const res = await api.get('/dashboard', { params });
      setData(res.data);
    } catch (_) {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSummary(); }, [month]);

  const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n ?? 0);

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Dashboard</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Hello, {user?.name} 👋
          </p>
        </div>
        <div>
          <input type="month" className="form-control form-control-sm"
            value={month} onChange={(e) => setMonth(e.target.value)}
            style={{ minWidth: '160px' }} />
          {month && (
            <button className="btn btn-sm btn-link text-muted p-0 mt-1"
              onClick={() => setMonth('')}>Clear filter</button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      {loading ? (
        <div className="text-center py-5 text-muted">Loading…</div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-md-4">
              <div className="summary-card income">
                <div className="label">TOTAL INCOME</div>
                <div className="amount">{fmt(data?.total_income)}</div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <div className="summary-card expense">
                <div className="label">TOTAL EXPENSES</div>
                <div className="amount">{fmt(data?.total_expense)}</div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <div className="summary-card balance">
                <div className="label">REMAINING BALANCE</div>
                <div className="amount">{fmt(data?.balance)}</div>
              </div>
            </div>
          </div>

          {/* Expense by category */}
          {data?.by_category?.length > 0 && (
            <div className="table-card p-3">
              <h6 className="fw-bold mb-3">Expenses by Category</h6>
              <div className="row g-2">
                {data.by_category.map((cat, i) => (
                  <div key={i} className="col-sm-6 col-md-4">
                    <div className="d-flex align-items-center gap-2 p-2 rounded"
                      style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <span>{cat.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{cat.category}</div>
                        <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700 }}>
                          {fmt(cat.total)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
