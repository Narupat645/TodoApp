import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardStats from './components/DashboardStats';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import { getTasks, createTask, updateTask, deleteTask as deleteTaskApi } from './api';
import { today, isOverdue, isDueToday } from './utils';

const DEFAULT_GROUPS = ['ส่วนตัว', 'งาน', 'การศึกษา'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('all');
  const [currentPriority, setCurrentPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Derive groups from task data + defaults
  const groups = useMemo(() => {
    const fromTasks = tasks.map((t) => t.group).filter(Boolean);
    const all = [...new Set([...DEFAULT_GROUPS, ...fromTasks])];
    return all;
  }, [tasks]);

  // Fetch tasks on mount
  const fetchTasks = useCallback(async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Keyboard shortcut: Ctrl+N to add task
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        setEditId(null);
        setModalOpen(true);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // Search filter
    const q = searchQuery.toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.group || '').toLowerCase().includes(q)
      );
    }

    // Priority filter
    if (currentPriority) {
      list = list.filter((t) => t.priority === currentPriority);
    }

    // View filter
    const td = today();
    if (currentView === 'today') {
      list = list.filter((t) => isDueToday(t.due) && !t.done);
    } else if (currentView === 'upcoming') {
      list = list.filter(
        (t) => t.due && t.due > td && !t.done && !isDueToday(t.due)
      );
    } else if (currentView === 'overdue') {
      list = list.filter((t) => isOverdue(t.due) && !t.done);
    } else if (currentView === 'done') {
      list = list.filter((t) => t.done);
    } else if (currentView !== 'all') {
      // Group view
      list = list.filter((t) => t.group === currentView);
    }

    // Sort: not-done first, then by priority
    const po = { high: 0, medium: 1, low: 2 };
    list.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return (po[a.priority] ?? 1) - (po[b.priority] ?? 1);
    });

    return list;
  }, [tasks, searchQuery, currentPriority, currentView]);

  // Handlers
  const handleToggleDone = async (id, currentDone) => {
    try {
      await updateTask(id, { done: !currentDone });
      fetchTasks();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTaskApi(id);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleEditTask = (id) => {
    setEditId(id);
    setModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditId(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const handleSaveTask = async ({ title, group, priority, due, newGroup }) => {
    try {
      if (editId) {
        await updateTask(editId, { title, group, priority, due });
      } else {
        await createTask({
          title,
          group,
          priority,
          due,
          done: false,
          created: today(),
        });
      }
      handleCloseModal();
      fetchTasks();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  // Find the task being edited
  const editingTask = editId
    ? tasks.find((t) => (t._id || t.id) === editId) || null
    : null;

  return (
    <>
      <Sidebar
        tasks={tasks}
        groups={groups}
        currentView={currentView}
        setView={setCurrentView}
      />
      <div className="main">
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentPriority={currentPriority}
          setPriority={setCurrentPriority}
          openModal={handleOpenModal}
        />
        <div className="content">
          <DashboardStats tasks={tasks} />
          <TaskList
            filteredTasks={filteredTasks}
            currentView={currentView}
            groups={groups}
            toggleDone={handleToggleDone}
            editTask={handleEditTask}
            deleteTask={handleDeleteTask}
          />
        </div>
      </div>
      <TaskModal
        open={modalOpen}
        editTask={editingTask}
        groups={groups}
        onSave={handleSaveTask}
        onClose={handleCloseModal}
      />
    </>
  );
}
