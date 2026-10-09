'use strict';
const filters = [...document.querySelectorAll('.scope-filter')];
const cards = [...document.querySelectorAll('.task-card')];
const search = document.querySelector('#task-search');
let scope = 'all';
function filterTasks() {
  const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let visible = 0;
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const matches = (scope === 'all' || card.dataset.scope === scope) && terms.every(term => text.includes(term));
    card.hidden = !matches;
    if (matches) visible++;
  });
  document.querySelector('#empty-state').hidden = visible !== 0;
  const label = scope === 'all' ? 'all manufacturing tasks' : scope;
  document.querySelector('#filter-status').textContent = terms.length ? `${visible} matching ${visible === 1 ? 'task' : 'tasks'} · ${label}` : `Showing ${label}`;
}
filters.forEach(button => button.addEventListener('click', () => {
  scope = button.dataset.scope;
  filters.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  filterTasks();
}));
search.addEventListener('input', filterTasks);
document.querySelector('#reset-filters').addEventListener('click', () => {
  search.value = '';
  filters[0].click();
  search.focus();
});
document.querySelector('#copy-citation').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(document.querySelector('#bibtex').textContent);
    status.textContent = 'BibTeX copied.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#bibtex'));
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    status.textContent = 'BibTeX selected. Press Ctrl+C (or Command+C) to copy.';
  }
});
