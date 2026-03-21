import React from 'react';
import { today, isOverdue } from '../utils';

export default function DashboardStats({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pending = tasks.filter((t) => !t.done).length;
  const overdue = tasks.filter((t) => isOverdue(t.due) && !t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <>
      <div className="dashboard">
        <div className="stat-card blue">
          <div className="stat-icon">📋</div>
          <div className="stat-num">{total}</div>
          <div className="stat-label">งานทั้งหมด</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-num">{done}</div>
          <div className="stat-label">เสร็จแล้ว</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-num">{pending}</div>
          <div className="stat-label">ยังค้างอยู่</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">⚠️</div>
          <div className="stat-num">{overdue}</div>
          <div className="stat-label">เกินกำหนด</div>
        </div>
      </div>

      <div
        className="stat-card"
        style={{
          marginBottom: '24px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--display)',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            ความคืบหน้าโดยรวม
          </span>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--green)',
              fontWeight: 600,
            }}
          >
            {pct}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: pct + '%' }}
          ></div>
        </div>
      </div>
    </>
  );
}
