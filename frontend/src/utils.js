// Colors for groups
export const groupColors = [
  '#5b8dee',
  '#7c5cbf',
  '#3ecf8e',
  '#f5a623',
  '#f05f5f',
  '#00bcd4',
  '#ff6b9d',
  '#a0c4ff',
];

export function getGroupColor(groups, g) {
  const i = groups.indexOf(g);
  return groupColors[i % groupColors.length] || '#7a82a0';
}

// Date helpers
export function today() {
  return new Date().toISOString().split('T')[0];
}

export function isOverdue(due) {
  return due && due < today();
}

export function isDueToday(due) {
  return due === today();
}

export function isDueSoon(due) {
  if (!due) return false;
  const d = new Date(due);
  const t = new Date();
  const diff = (d - t) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 3;
}

export function formatDate(due) {
  if (!due) return '';
  const d = new Date(due + 'T00:00:00');
  return d.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
