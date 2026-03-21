import React from 'react';
import {
  getGroupColor,
  isOverdue,
  isDueSoon,
  formatDate,
} from '../utils';

export default function TaskList({
  filteredTasks,
  currentView,
  groups,
  toggleDone,
  editTask,
  deleteTask,
}) {
  const titles = {
    all: 'งานทั้งหมด',
    today: 'วันนี้',
    upcoming: 'กำลังจะมา',
    overdue: 'เกินกำหนด',
    done: 'เสร็จแล้ว',
  };

  const sectionTitle = titles[currentView] || currentView;

  return (
    <>
      <div className="section-header">
        <span className="section-title">{sectionTitle}</span>
        <span className="section-count">{filteredTasks.length} รายการ</span>
      </div>
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>ไม่มีรายการงาน</p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const col = t.group
              ? getGroupColor(groups, t.group)
              : 'transparent';
            const overdue = isOverdue(t.due) && !t.done;
            const soon = isDueSoon(t.due) && !t.done && !overdue;
            const dateClass = overdue ? 'overdue' : soon ? 'soon' : '';
            const prioText =
              { high: 'เร่งด่วน', medium: 'ปานกลาง', low: 'ปกติ' }[
                t.priority
              ] || '';
            const prioClass = 'priority-' + (t.priority || 'low');
            const taskId = t._id || t.id;

            return (
              <div
                className={`task-item${t.done ? ' done' : ''}`}
                key={taskId}
              >
                <div
                  className="task-check"
                  onClick={() => toggleDone(taskId, t.done)}
                >
                  {t.done ? '✓' : ''}
                </div>
                <div className="task-info">
                  <div className="task-title">{t.title}</div>
                  <div className="task-meta">
                    <span className={`tag ${prioClass}`}>{prioText}</span>
                    {t.group && (
                      <span
                        className="tag group-tag"
                        style={{
                          background: col + '20',
                          color: col,
                        }}
                      >
                        {t.group}
                      </span>
                    )}
                    {t.due && (
                      <span className={`due-date ${dateClass}`}>
                        📅 {formatDate(t.due)}
                        {overdue ? ' (เกินกำหนด)' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    className="task-btn"
                    onClick={() => editTask(taskId)}
                    title="แก้ไข"
                  >
                    ✏️
                  </button>
                  <button
                    className="task-btn delete"
                    onClick={() => deleteTask(taskId)}
                    title="ลบ"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
