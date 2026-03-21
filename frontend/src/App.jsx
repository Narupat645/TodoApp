import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardStats from './components/DashboardStats';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import Auth from './components/Auth'; // 👈 เพิ่มหน้า Auth
import { getTasks, createTask, updateTask, deleteTask as deleteTaskApi } from './api';
import { today, isOverdue, isDueToday } from './utils';
import './index.css';

const DEFAULT_GROUPS = ['ส่วนตัว', 'งาน', 'การศึกษา'];

export default function App() {
  // --- 1. State สำหรับระบบสมาชิก ---
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  // --- 2. State สำหรับงาน (จากโค้ดเดิมของคุณ) ---
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('all');
  const [currentPriority, setCurrentPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Derive groups
  const groups = useMemo(() => {
    const fromTasks = tasks.map((t) => t.group).filter(Boolean);
    return [...new Set([...DEFAULT_GROUPS, ...fromTasks])];
  }, [tasks]);

  // Fetch tasks (ปรับให้ใช้ useCallback และดัก Error 401)
  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      if (err.response?.status === 401) handleLogout(); // ถ้าตั๋วหมดอายุ ให้เตะออก
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- 3. ฟังก์ชันระบบสมาชิก ---
  const handleLogin = (newToken, newUsername) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setTasks([]);
  };

  // --- 4. Keyboard Shortcuts (Ctrl+N) ---
  useEffect(() => {
    if (!token) return;
    const handleKey = (e) => {
      if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        setEditId(null);
        setModalOpen(true);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [token]);

  // --- 5. Logic การ Filter งาน (จากโค้ดเดิมของคุณ) ---
  const filteredTasks = useMemo(() => {
    let list = [...tasks];
    const q = searchQuery.toLowerCase();
    if (q) {
      list = list.filter(t => t.title.toLowerCase().includes(q) || (t.group || '').toLowerCase().includes(q));
    }
    if (currentPriority) list = list.filter(t => t.priority === currentPriority);

    const td = today();
    if (currentView === 'today') list = list.filter(t => isDueToday(t.due) && !t.done);
    else if (currentView === 'upcoming') list = list.filter(t => t.due && t.due > td && !t.done && !isDueToday(t.due));
    else if (currentView === 'overdue') list = list.filter(t => isOverdue(t.due) && !t.done);
    else if (currentView === 'done') list = list.filter(t => t.done);
    else if (currentView !== 'all') list = list.filter(t => t.group === currentView);

    const po = { high: 0, medium: 1, low: 2 };
    list.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return (po[a.priority] ?? 1) - (po[b.priority] ?? 1);
    });
    return list;
  }, [tasks, searchQuery, currentPriority, currentView]);

  // --- 6. Handlers จัดการงาน ---
  const handleSaveTask = async (data) => {
    try {
      if (editId) {
        await updateTask(editId, data);
      } else {
        await createTask({ ...data, done: false, created: today() });
      }
      setModalOpen(false);
      setEditId(null);
      fetchTasks();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('ลบงานนี้ใช่ไหม?')) {
      try {
        await deleteTaskApi(id);
        fetchTasks();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  // --- 7. การแสดงผล (Render) ---
  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <>
      <Sidebar
        tasks={tasks}
        groups={groups}
        currentView={currentView}
        setView={setCurrentView}
        onLogout={handleLogout} // 👈 ส่งปุ่ม Logout ไปที่ Sidebar
      />
      <div className="main">
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentPriority={currentPriority}
          setPriority={setCurrentPriority}
          openModal={() => { setEditId(null); setModalOpen(true); }}
          username={username} // 👈 ส่งชื่อผู้ใช้ไปโชว์ที่ Topbar
          onLogout={handleLogout}
        />
        <div className="content">
          <DashboardStats tasks={tasks} />
          <TaskList
            filteredTasks={filteredTasks}
            currentView={currentView}
            groups={groups}
            toggleDone={(id, done) => updateTask(id, { done: !done }).then(fetchTasks)}
            editTask={(id) => { setEditId(id); setModalOpen(true); }}
            deleteTask={handleDeleteTask}
          />
        </div>
      </div>
      <TaskModal
        open={modalOpen}
        editTask={editId ? tasks.find(t => (t._id || t.id) === editId) : null}
        groups={groups}
        onSave={handleSaveTask}
        onClose={() => { setModalOpen(false); setEditId(null); }}
      />
    </>
  );
}