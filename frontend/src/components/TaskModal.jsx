import React, { useState, useEffect, useRef } from 'react';

export default function TaskModal({ open, editTask, groups, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [group, setGroup] = useState('');
  const [priority, setPriority] = useState('medium');
  const [due, setDue] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const titleRef = useRef(null);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (open) {
      if (editTask) {
        setTitle(editTask.title || '');
        setGroup(editTask.group || '');
        setPriority(editTask.priority || 'medium');
        setDue(editTask.due || '');
      } else {
        setTitle('');
        setGroup('');
        setPriority('medium');
        setDue('');
      }
      setNewGroup('');
      setTitleError(false);
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open, editTask]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError(true);
      return;
    }
    setTitleError(false);

    let finalGroup = group;
    const trimNewGroup = newGroup.trim();
    if (trimNewGroup) finalGroup = trimNewGroup;

    onSave({
      title: trimmed,
      group: finalGroup,
      priority,
      due,
      newGroup: trimNewGroup,
    });
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-title">
          {editTask ? '✏️ แก้ไขงาน' : '➕ เพิ่มงานใหม่'}
        </div>
        <div className="form-group">
          <label className="form-label">ชื่องาน *</label>
          <input
            className="form-input"
            ref={titleRef}
            placeholder="เช่น ทำรายงานประจำเดือน..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={titleError ? { borderColor: 'var(--red)' } : {}}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">กลุ่มงาน</label>
            <select
              className="form-select"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value="">-- เลือกกลุ่ม --</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">ความสำคัญ</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">🟢 ปกติ</option>
              <option value="medium">🟡 ปานกลาง</option>
              <option value="high">🔴 เร่งด่วน</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">กำหนดส่ง</label>
            <input
              className="form-input"
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">กลุ่มใหม่ (ถ้ายังไม่มี)</label>
            <input
              className="form-input"
              placeholder="ชื่อกลุ่มใหม่..."
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="btn-save" onClick={handleSave}>
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
