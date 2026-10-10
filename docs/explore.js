/* The public reading lists are the source of truth; no server or API is needed. */
(() => {
  "use strict";
  const { tasks, papers } = window.MANUFACTURING_CATALOGUE;
  const byTask = new Map(tasks.map((t) => [t.id, t]));
  const scopes = ["artifacts", "processes", "equipment", "production", "fabs"];
  const scopeIcons = [
    "artifact_wide",
    "process",
    "equipment",
    "production",
    "fab_vertical",
  ];
  const icons = [
    "wafer",
    "local",
    "lithography",
    "quality",
    "root_cause",
    "probe",
    "monitoring_clear",
    "vm_clear",
    "recipes_clear",
    "feedback_clear",
    "diagnosis",
    "prognosis",
    "qualification",
    "cycle_time",
    "schedule",
    "transport",
    "bottleneck",
    "utility",
    "capacity",
  ];
  const $ = (s) => document.querySelector(s);
  const search = $("#paper-search"),
    scopeFilter = $("#scope-filter"),
    yearFilter = $("#year-filter"),
    sortFilter = $("#sort-filter");
  const results = $("#paper-results"),
    more = $("#load-more");
  const normalize = (s) =>
    s
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const searchText = new Map(
    papers.map((p) => [
      p.id,
      normalize(p.title + " " + p.authors + " " + p.venue),
    ]),
  );
  let state,
    limit = 24,
    searchTimer;
  function readState() {
    const q = new URLSearchParams(location.search);
    const task = byTask.has(q.get("task")) ? q.get("task") : "";
    return {
      task,
      scope: task
        ? byTask.get(task).scope
        : scopes.includes(q.get("scope"))
          ? q.get("scope")
          : "",
      q: q.get("q") || "",
      year: /^\d{4}$/.test(q.get("year") || "") ? q.get("year") : "",
      sort: q.get("sort") === "oldest" ? "oldest" : "newest",
    };
  }
  function setState(next, replace = false) {
    clearTimeout(searchTimer);
    state = { ...state, ...next };
    limit = 24;
    const q = new URLSearchParams();
    if (state.task) q.set("task", state.task);
    else if (state.scope) q.set("scope", state.scope);
    if (state.q) q.set("q", state.q);
    if (state.year) q.set("year", state.year);
    if (state.sort !== "newest") q.set("sort", state.sort);
    history[replace ? "replaceState" : "pushState"](
      null,
      "",
      location.pathname + (q.size ? "?" + q : ""),
    );
    render();
  }
  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function external(href, text, className) {
    const a = el("a", className, text),
      url = new URL(href);
    if (!["https:", "http:"].includes(url.protocol))
      return el("span", className, text);
    a.href = url.href;
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  }
  function paperCard(p) {
    const card = el("article", "paper-card");
    card.dataset.paper = p.id;
    card.dataset.task = p.task;
    card.append(el("div", "paper-year", p.year));
    const body = el("div", "paper-body"),
      h = el("h2");
    const link = external(p.url, p.title),
      arrow = el("span", "", "↗");
    arrow.setAttribute("aria-hidden", "true");
    link.append(arrow);
    h.append(link);
    body.append(h, el("p", "paper-meta", p.authors + " · " + p.venue));
    const bottom = el("div", "paper-bottom"),
      tag = el(
        "a",
        "task-chip " + p.scope,
        p.task + " · " + byTask.get(p.task).title,
      );
    tag.href = "explore.html?task=" + p.task;
    tag.dataset.selectTask = p.task;
    bottom.append(tag);
    for (const resource of p.resources)
      bottom.append(
        external(resource.url, resource.label + " ↗", "paper-resource"),
      );
    body.append(bottom);
    card.append(body);
    return card;
  }
  function filteredBase() {
    return papers.filter(
      (p) =>
        (!state.task || p.task === state.task) &&
        (!state.scope || p.scope === state.scope),
    );
  }
  function render(append = false) {
    const task = byTask.get(state.task),
      scopeIndex = scopes.indexOf(state.scope);
    $("#library-title").textContent = task
      ? task.id + " · " + task.title
      : state.scope
        ? "AI for " + state.scope
        : "Explore the literature.";
    $("#library-question").textContent =
      task?.question ||
      (state.scope
        ? "Browse the tasks and research within this manufacturing scope."
        : "Search across manufacturing tasks, or start with a question from the atlas.");
    $("#library-icon").src = task
      ? "assets/icons/" + icons[tasks.indexOf(task)] + ".png"
      : scopeIndex >= 0
        ? "assets/icons/" + scopeIcons[scopeIndex] + ".png"
        : "assets/web/brand.png";
    document.title =
      (task
        ? task.id + " · " + task.title
        : state.scope
          ? "AI for " + state.scope
          : "Paper library") + " · AI × Manufacturing";
    search.value = state.q;
    scopeFilter.value = state.scope;
    sortFilter.value = state.sort;
    const base = filteredBase(),
      years = [...new Set(base.map((p) => p.year))].sort((a, b) => b - a);
    yearFilter.replaceChildren(
      new Option("All years", ""),
      ...years.map((y) => new Option(y, String(y))),
    );
    if (state.year && !years.includes(Number(state.year)))
      yearFilter.add(new Option(state.year, state.year));
    yearFilter.value = state.year;
    document.querySelectorAll(".scope-nav a").forEach((a) => {
      if (a.dataset.selectTask === state.task)
        a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    const terms = normalize(state.q).trim().split(/\s+/).filter(Boolean);
    const filtered = base
      .filter(
        (p) =>
          (!state.year || p.year === Number(state.year)) &&
          terms.every((term) => searchText.get(p.id).includes(term)),
      )
      .sort(
        (a, b) =>
          (state.sort === "newest" ? b.year - a.year : a.year - b.year) ||
          a.title.localeCompare(b.title),
      );
    const start = append ? results.children.length : 0;
    if (!append) results.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (const p of filtered.slice(start, limit)) fragment.append(paperCard(p));
    results.append(fragment);
    if (!filtered.length) {
      const empty = el("div", "no-results"),
        icon = el("img");
      icon.src = "assets/icons/local.png";
      icon.alt = "";
      empty.append(
        icon,
        el("h2", "", "No matching papers"),
        el("p", "", "Try a different search term, or reset the filters."),
      );
      results.append(empty);
    }
    $("#result-count").textContent = filtered.length
      ? filtered.length +
        " " +
        (filtered.length === 1 ? "paper" : "papers") +
        " · showing " +
        Math.min(limit, filtered.length) +
        (task ? " in " + task.id : "")
      : "No papers match these filters";
    more.hidden = limit >= filtered.length;
    if (!append) window.AtlasUI?.reveal(results, { y: 8, duration: 0.3 });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-select-task], [data-all-papers]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)
      return;
    e.preventDefault();
    setState({
      task: a.dataset.selectTask || "",
      scope: a.dataset.selectTask ? byTask.get(a.dataset.selectTask).scope : "",
      q: "",
      year: "",
      sort: "newest",
    });
    if (matchMedia("(max-width:800px)").matches) {
      $(".library-nav").classList.remove("expanded");
      $(".library-nav-toggle").setAttribute("aria-expanded", "false");
      $(".library-nav-toggle span").textContent = "+";
      $(".library-body").scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    }
  });
  $(".library-controls").addEventListener("submit", (e) => e.preventDefault());
  search.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => setState({ q: search.value }, true), 160);
  });
  scopeFilter.addEventListener("change", () =>
    setState({ scope: scopeFilter.value, task: "", year: "" }),
  );
  yearFilter.addEventListener("change", () =>
    setState({ year: yearFilter.value }),
  );
  sortFilter.addEventListener("change", () =>
    setState({ sort: sortFilter.value }),
  );
  $("#reset-filters").addEventListener("click", () => {
    setState({ q: "", year: "", sort: "newest" });
    search.focus();
  });
  more.addEventListener("click", () => {
    const first = results.children.length;
    limit += 24;
    render(true);
    results.children[first]
      ?.querySelector("h2 a")
      ?.focus({ preventScroll: true });
  });
  window.addEventListener("popstate", () => {
    clearTimeout(searchTimer);
    state = readState();
    limit = 24;
    render();
  });
  state = readState();
  $(".library-nav-toggle").addEventListener("click", () => {
    const nav = $(".library-nav"),
      expanded = nav.classList.toggle("expanded");
    $(".library-nav-toggle").setAttribute("aria-expanded", String(expanded));
    $(".library-nav-toggle span").textContent = expanded ? "−" : "+";
  });
  if (matchMedia("(max-width:800px)").matches)
    document
      .querySelectorAll(".scope-nav")
      .forEach(
        (d) => (d.open = !!state.task && d.classList.contains(state.scope)),
      );
  render();
})();
