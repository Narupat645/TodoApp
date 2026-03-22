import React, { useState, useEffect, useRef } from 'react';
import { getAllUsers } from '../api';

export default function TaskModal({ open, editTask, groups, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [group, setGroup] = useState('');
  const [priority, setPriority] = useState('medium');
  const [due, setDue] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [assignees, setAssignees] = useState('');

  // --- Mention States ---
  const [allUsers, setAllUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const titleRef = useRef(null);
  const [titleError, setTitleError] = useState(false);

  // ดึงรายชื่อ User ทั้งหมด
  useEffect(() => {
    if (open) {
      getAllUsers()
        .then(res => setAllUsers(res.data))
        .catch(err => console.error("Load users failed:", err));

      if (editTask) {
        setTitle(editTask.title || '');
        setGroup(editTask.group || '');
        setPriority(editTask.priority || 'medium');
        setDue(editTask.due || '');
        setAssignees(editTask.assignees ? editTask.assignees.join(', ') : '');
      } else {
        setTitle(''); setGroup(''); setPriority('medium'); setDue(''); setAssignees('');
      }
      setNewGroup(''); setTitleError(false);
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open, editTask]);

  // --- Logic ตรวจจับ @ ---
  const handleAssigneesChange = (e) => {
    const value = e.target.value;
    setAssignees(value);

    // หาคำสุดท้ายที่กำลังพิมพ์
    const words = value.split(/[ ,]/); // แยกด้วยช่องว่าง หรือ ลูกน้ำ
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith('@')) {
      const query = lastWord.slice(1).toLowerCase();
      // กรองรายชื่อที่ตรงกับที่พิมพ์
      const filtered = allUsers.filter(u =>
        u.username.toLowerCase().includes(query)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // เมื่อคลิกเลือกชื่อจากรายการแนะนำ
  const selectUser = (username) => {
    const words = assignees.split(/[ ,]/);
    words.pop(); // เอาคำที่พิมพ์ @ ออก
    const newValue = [...words.filter(w => w !== ''), username].join(', ');
    setAssignees(newValue + ', '); // เติมลูกน้ำรอให้สำหรับคนถัดไป
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!title.trim()) { setTitleError(true); return; }
    let finalGroup = newGroup.trim() || group;
    const assigneesArray = assignees.split(',').map(a => a.trim()).filter(a => a !== '');

    onSave({
      title: title.trim(),
      group: finalGroup,
      priority,
      due,
      assignees: assigneesArray,
    });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{editTask ? '✏️ แก้ไขงาน' : '➕ เพิ่มงานใหม่'}</div>

        <div className="form-group">
          <label className="form-label">ชื่องาน *</label>
          <input className="form-input" ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)} style={titleError ? { borderColor: 'var(--red)' } : {}} />
        </div>

        {/* --- ส่วนผู้รับผิดชอบที่มี Mentions --- */}
        <div className="form-group" style={{ position: 'relative' }}>
          <label className="form-label">ผู้รับผิดชอบ (พิมพ์ @ เพื่อแท็กเพื่อน)</label>
          <input
            className="form-input"
            placeholder="เช่น @somchai, @nattapong"
            value={assignees}
            onChange={handleAssigneesChange}
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="mention-suggestions">
              {suggestions.map(user => (
                <div key={user._id} className="mention-item" onClick={() => selectUser(user.username)}>
                  <span className="mention-avatar">{user.username[0].toUpperCase()}</span>
                  <span className="mention-name">@{user.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">กลุ่มงาน</label>
            <select className="form-select" value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">-- เลือกกลุ่ม --</option>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">ความสำคัญ</label>
            <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">🟢 ปกติ</option>
              <option value="medium">🟡 ปานกลาง</option>
              <option value="high">🔴 เร่งด่วน</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">กำหนดส่ง</label>
            <input className="form-input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">กลุ่มใหม่</label>
            <input className="form-input" placeholder="ชื่อกลุ่มใหม่..." value={newGroup} onChange={(e) => setNewGroup(e.target.value)} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>ยกเลิก</button>
          <button className="btn-save" onClick={handleSave}>บันทึก</button>
        </div>
      </div>
    </div>
  );
}