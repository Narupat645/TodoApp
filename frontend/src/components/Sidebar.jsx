import React from 'react';
import { getGroupColor, today, isDueToday, isOverdue } from '../utils';

export default function Sidebar({ tasks, groups, currentView, setView }) {
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
      <div className="logo">
        TaskFlow<span>จัดการงานของคุณ</span>
      </div>

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

      <div className="nav-label" style={{ marginTop: '8px' }}>
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
    </aside>
  );
}
