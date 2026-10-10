'use strict';

// The figures and reading lists remain usable without JavaScript.
const repo = 'https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing';
const filters = [...document.querySelectorAll('.scope-filter')];
const rows = [...document.querySelectorAll('.task-row')];
const groups = [...document.querySelectorAll('.task-group')];
const search = document.querySelector('#task-search');
let scope = 'all';
function filterTasks(syncUrl = true) {
  const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let visible = 0;
  rows.forEach(row => {
    row.hidden = !((scope === 'all' || row.dataset.scope === scope)
      && terms.every(term => row.textContent.toLowerCase().includes(term)));
    if (!row.hidden) visible++;
  });
  groups.forEach(group => { group.hidden = ![...group.querySelectorAll('.task-row')].some(row => !row.hidden); });
  filters.forEach(button => {
    const active = button.dataset.scope === scope;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#empty-state').hidden = visible !== 0;
  const label = scope === 'all' ? 'all manufacturing tasks' : scope;
  document.querySelector('#filter-status').textContent = terms.length
    ? `${visible} matching ${visible === 1 ? 'task' : 'tasks'} in ${label}` : `Showing ${label}`;
  if (syncUrl) {
    const url = new URL(location.href);
    scope === 'all' ? url.searchParams.delete('scope') : url.searchParams.set('scope', scope);
    search.value.trim() ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
    history.replaceState(null, '', url);
  }
}
function restoreFilters() {
  const params = new URLSearchParams(location.search);
  const candidate = params.get('scope');
  scope = filters.some(button => button.dataset.scope === candidate) ? candidate : 'all';
  search.value = params.get('q') || '';
  filterTasks(false);
}
filters.forEach(button => button.addEventListener('click', () => { scope = button.dataset.scope; filterTasks(); }));
search.addEventListener('input', () => filterTasks());
document.querySelector('#reset-filters').addEventListener('click', () => {
  scope = 'all'; search.value = ''; filterTasks(); search.focus();
});
window.addEventListener('popstate', restoreFilters);
restoreFilters();

// Percentage-based hit regions follow Fig. 1 at every displayed size.
const mapStatus = document.querySelector('#map-status');
const mapDefault = mapStatus.textContent;
let hoveredTask = null;
function describeMapTask() {
  const focused = document.activeElement;
  const link = focused?.matches('.hotspot:focus-visible') ? focused : hoveredTask;
  mapStatus.textContent = link ? `${link.dataset.task} · ${link.dataset.title}` : mapDefault;
}
function bindMap(container) {
  container.querySelectorAll('.hotspot').forEach(link => {
    link.addEventListener('pointerenter', () => { hoveredTask = link; describeMapTask(); });
    link.addEventListener('focus', describeMapTask);
    link.addEventListener('pointerleave', () => { if (hoveredTask === link) hoveredTask = null; describeMapTask(); });
    link.addEventListener('blur', describeMapTask);
  });
}
bindMap(document.querySelector('#main-map'));
const mapDialog = document.querySelector('#map-dialog');
const enlarge = document.querySelector('#enlarge-map');
enlarge.addEventListener('click', event => {
  if (typeof mapDialog.showModal !== 'function') return;
  event.preventDefault();
  const expanded = document.querySelector('#expanded-map');
  if (!expanded.firstElementChild) {
    const map = document.querySelector('#main-map').cloneNode(true);
    map.removeAttribute('id'); expanded.append(map); bindMap(expanded);
  }
  mapDialog.showModal(); document.querySelector('#close-map').focus();
});
document.querySelector('#close-map').addEventListener('click', () => mapDialog.close());
mapDialog.addEventListener('click', event => { if (event.target === mapDialog) mapDialog.close(); });
mapDialog.addEventListener('close', () => { hoveredTask = null; enlarge.focus(); describeMapTask(); });

const stages = {
  perception: ['What is happening?', 'Recognize patterns in images and signals, such as defects on a wafer or changes in a sensor trace.', 'Explore wafer spatial-pattern analysis', 'artifacts.md#a1'],
  prediction: ['What is still unknown?', 'Estimate an outcome before it can be measured, such as product quality or the time a lot will finish.', 'Explore virtual metrology', 'processes.md#p2'],
  reasoning: ['Why is it happening?', 'Connect observations with manufacturing knowledge to investigate possible causes and decide what evidence is needed.', 'Explore yield-loss and root-cause diagnosis', 'artifacts.md#a5'],
  planning: ['What should happen next?', 'Choose process settings, experiments or schedules by considering what different actions could achieve.', 'Explore scheduling and dispatching', 'production.md#r2'],
  autonomy: ['How do we act and adapt?', 'Connect observation, decision and execution, then use feedback to adjust as operating conditions change.', 'Explore run-to-run and feedback control', 'processes.md#p4']
};
const tabs = [...document.querySelectorAll('[data-stage]')];
function activateStage(tab) {
  tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  const [question, description, label, path] = stages[tab.dataset.stage];
  document.querySelector('#stage-question').textContent = question;
  document.querySelector('#stage-description').textContent = description;
  const example = document.querySelector('#stage-example');
  example.firstChild.textContent = `${label} `;
  example.href = `${repo}/blob/master/papers/${path}`;
  document.querySelector('#stage-panel').setAttribute('aria-labelledby', tab.id);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateStage(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault(); tabs[next].focus(); activateStage(tabs[next]);
  });
});

document.querySelector('#copy-citation').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(document.querySelector('#bibtex').textContent);
    status.textContent = 'BibTeX copied.';
  } catch {
    const range = document.createRange(); range.selectNodeContents(document.querySelector('#bibtex'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    status.textContent = 'BibTeX selected. Press Ctrl+C (or Command+C) to copy.';
  }
});

// Read the real GitHub total, including zero. A click never changes the count locally.
const starCountNodes = [...document.querySelectorAll('.star-count')];
const starCacheKey = 'semiconductor-survey-stars';
let lastStarCount = null;
let lastStarRefresh = 0;
let starRequestPending = false;
let returningFromGitHub = false;
function showStars(count, cached = false) {
  if (!Number.isInteger(count) || count < 0) return;
  lastStarCount = count;
  starCountNodes.forEach(node => {
    node.textContent = new Intl.NumberFormat('en').format(count);
    node.setAttribute('aria-label', `${count} GitHub stars`);
    node.title = cached ? 'Last known GitHub star count' : `${count} stars on GitHub`;
    node.hidden = false;
  });
}
starCountNodes.forEach(node => {
  node.textContent = '…';
  node.setAttribute('aria-label', 'Loading GitHub star count');
  node.hidden = false;
});
try {
  const cached = JSON.parse(sessionStorage.getItem(starCacheKey) || 'null');
  if (cached) showStars(cached.count, true);
} catch { /* Browser storage is optional. */ }
async function loadStars(force = false) {
  if (starRequestPending || (!force && Date.now() - lastStarRefresh < 60000)) return;
  starRequestPending = true;
  returningFromGitHub = false;
  lastStarRefresh = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch('https://api.github.com/repos/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing', { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error('Star count unavailable');
    const data = await response.json();
    if (!Number.isInteger(data.stargazers_count) || data.stargazers_count < 0) throw new Error('Invalid star count');
    showStars(data.stargazers_count);
    try { sessionStorage.setItem(starCacheKey, JSON.stringify({ count: data.stargazers_count, time: Date.now() })); } catch { /* Optional cache. */ }
  } catch {
    if (lastStarCount !== null) showStars(lastStarCount, true);
    else starCountNodes.forEach(node => {
      node.textContent = '—';
      node.setAttribute('aria-label', 'GitHub star count unavailable');
      node.title = 'GitHub star count is temporarily unavailable';
    });
  } finally { clearTimeout(timeout); starRequestPending = false; }
}
document.querySelectorAll('.star-link').forEach(link => {
  link.addEventListener('click', () => { returningFromGitHub = true; });
});
function refreshStarsOnReturn() {
  if (document.visibilityState === 'visible') loadStars(returningFromGitHub);
}
window.addEventListener('focus', refreshStarsOnReturn);
document.addEventListener('visibilitychange', refreshStarsOnReturn);
loadStars(true);
