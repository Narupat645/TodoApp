import React from 'react';

export default function Topbar({
  searchQuery,
  setSearchQuery,
  currentPriority,
  setPriority,
  openModal,
}) {
  const filters = [
    { key: '', label: 'ทั้งหมด' },
    { key: 'high', label: '🔴 เร่งด่วน' },
    { key: 'medium', label: '🟡 ปานกลาง' },
    { key: 'low', label: '🟢 ปกติ' },
  ];

  return (
    <div className="topbar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="ค้นหางาน..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="filter-btns">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-btn${currentPriority === f.key ? ' active' : ''}`}
            onClick={() => setPriority(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <button className="add-btn" onClick={() => openModal()}>
        + เพิ่มงาน
      </button>
    </div>
  );
}
