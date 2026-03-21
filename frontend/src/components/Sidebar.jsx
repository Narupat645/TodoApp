import React from 'react';
import { getGroupColor, today, isDueToday, isOverdue } from '../utils';

export default function Sidebar({ tasks, groups, currentView, setView, onLogout }) {
  // --- Logic การนับ Badge (ของเดิมที่คุณเขียนไว้ ดีมากอยู่แล้ว) ---
  const badgeAll = tasks.filter((t) => !t.done).length;
  const badgeToday = tasks.filter((t) => isDueToday(t.due) && !t.done).length;
  const badgeUpcoming = tasks.filter(
    (t) => t.due && t.due > today() && !t.done && !isDueToday(t.due)
  ).length;
  const badgeOverdue = tasks.filter((t) => isOverdue(t.due) && !t.done).length;
  const badgeDone = tasks.filter((t) => t.done).length;

  const mainNav = [
    { key: 'all', icon: '📋', label: 'งานทั้งหมด', badge: badgeAll },
    { key: 'today', icon: '📅', label: 'วันนี้', badge: badgeToday },
    { key: 'upcoming', icon: '🔮', label: 'กำลังจะมา', badge: badgeUpcoming },
    { key: 'overdue', icon: '⚠️', label: 'เกินกำหนด', badge: badgeOverdue },
    { key: 'done', icon: '✅', label: 'เสร็จแล้ว', badge: badgeDone },
  ];

  return (
    <aside className="sidebar">
      {/* ส่วนบน: Logo */}
      <div className="logo">
        TaskFlow<span>จัดการงานของคุณ</span>
      </div>

      {/* ส่วนกลาง: เมนูนำทาง (Nav) */}
      <div className="sidebar-content" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="nav-label">เมนูหลัก</div>
        {mainNav.map((item) => (
          <div
            key={item.key}
            className={`nav-item${currentView === item.key ? ' active' : ''}`}
            onClick={() => setView(item.key)}
          >
            {item.icon} <span>{item.label}</span>
            <span className="badge">{item.badge}</span>
          </div>
        ))}

        <div className="nav-label" style={{ marginTop: '16px' }}>
          กลุ่มงาน
        </div>
        {groups.map((g) => {
          const cnt = tasks.filter((t) => t.group === g && !t.done).length;
          const col = getGroupColor(groups, g);
          return (
            <div
              key={g}
              className={`nav-item${currentView === g ? ' active' : ''}`}
              onClick={() => setView(g)}
            >
              <span className="group-dot" style={{ background: col }}></span>
              <span>{g}</span>
              <span className="badge">{cnt}</span>
            </div>
          );
        })}
      </div>

      {/* --- 👇 ส่วนที่เพิ่มใหม่: ปุ่ม Logout อยู่ล่างสุด --- */}
      <div className="sidebar-footer" style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          🚪 ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}