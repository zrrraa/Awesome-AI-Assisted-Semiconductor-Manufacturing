/* The public reading lists are the source of truth; no server or API is needed. */
(() => {
  "use strict";
  const { tasks, papers, stages } = window.MANUFACTURING_CATALOGUE;
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
      scope: scopes.includes(q.get("scope")) ? q.get("scope") : "",
      stage:
        stages[q.get("stage")] || q.get("stage") === "supporting"
          ? q.get("stage")
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
    if (state.scope) q.set("scope", state.scope);
    if (state.stage) q.set("stage", state.stage);
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
  function resourceIcon(label) {
    const name = label.split(" · ")[0];
    if (name === "Hugging Face") {
      const n = el("span", "resource-icon", "🤗");
      n.setAttribute("aria-hidden", "true");
      return n;
    }
    const paths = {
      Paper: "M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6",
      arXiv: "m5 4 14 16 M8 4l11 12 M5 20l5-6 M14 10l5-6",
      GitHub:
        "M9 19c-4.3 1.3-4.3-2.2-6-2.6 M15 22v-3.4c0-1 .1-1.5-.5-2.1 3-.3 6.1-1.5 6.1-6.8a5.3 5.3 0 0 0-1.4-3.7 4.8 4.8 0 0 0-.1-3.6s-1.1-.4-3.7 1.4a12.5 12.5 0 0 0-6.8 0C6 2 4.9 2.4 4.9 2.4A4.8 4.8 0 0 0 4.8 6a5.3 5.3 0 0 0-1.4 3.7c0 5.3 3.1 6.5 6.1 6.8-.5.5-.6 1.1-.5 2.1V22",
      GitLab: "m12 21-9-7 2-11 4 8h6l4-8 2 11z M3 14l6-3 3 10 3-10 6 3",
      "Project page":
        "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3c-5 6-5 12 0 18 5-6 5-12 0-18",
      Dataset:
        "M4 6c0-4 16-4 16 0s-16 4-16 0v12c0 4 16 4 16 0V6 M4 12c0 4 16 4 16 0",
    };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "resource-icon");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", paths[name] || paths.Paper);
    svg.append(path);
    return svg;
  }
  function paperCard(p) {
    const card = el("article", "paper-card");
    card.dataset.paper = p.id;
    card.dataset.task = p.task;
    const body = el("div", "paper-body"),
      h = el("h2");
    h.textContent = p.title;
    const venue = el("span", "venue-chip", p.venueBadge);
    venue.title = p.venue ? p.venue + " · " + p.year : String(p.year);
    h.append(document.createTextNode(" "), venue);
    const authors = el("div", "paper-meta"),
      authorText = el("span");
    const names = p.authorList || [p.authors];
    authorText.id = "authors-" + p.id;
    authorText.textContent =
      names.length > 8
        ? names.slice(0, 5).join(", ") + ", …"
        : names.join(", ");
    authors.append(authorText);
    if (names.length > 8) {
      const toggle = el(
        "button",
        "authors-toggle",
        "Show all " + names.length + " authors",
      );
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", authorText.id);
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(expanded));
        authorText.textContent = expanded
          ? names.join(", ")
          : names.slice(0, 5).join(", ") + ", …";
        toggle.textContent = expanded
          ? "Show fewer"
          : "Show all " + names.length + " authors";
      });
      authors.append(toggle);
    }
    body.append(h, authors);
    const bottom = el("div", "paper-bottom"),
      tag = el(
        "a",
        "task-chip " + p.scope,
        p.task + " · " + byTask.get(p.task).title,
      );
    tag.href = "explore.html?task=" + p.task;
    tag.dataset.selectTask = p.task;
    const arxiv = p.url.match(
      /(?:arxiv\.(?:org\/(?:abs|pdf)\/)|arxiv[.:/])(\d{4}\.\d{4,5})/i,
    );
    const resources = [
      {
        url: arxiv ? "https://arxiv.org/abs/" + arxiv[1] : p.url,
        label: arxiv ? "arXiv" : "Paper",
      },
      ...p.resources,
    ];
    const seen = new Set();
    for (const resource of resources) {
      const key = resource.url.replace(/\/$/, "").toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const link = external(resource.url, "", "paper-resource");
      link.append(
        resourceIcon(resource.label),
        document.createTextNode(resource.label),
      );
      link.title = resource.label + " — " + new URL(resource.url).hostname;
      bottom.append(link);
    }
    const tags = el("div", "paper-tags");
    const scope = el(
      "a",
      "scope-chip " + p.catalogueScope,
      "M" +
        (scopes.indexOf(p.catalogueScope) + 1) +
        " · " +
        p.catalogueScope[0].toUpperCase() +
        p.catalogueScope.slice(1),
    );
    scope.href = "explore.html?scope=" + p.catalogueScope;
    scope.dataset.selectScope = p.catalogueScope;
    tags.append(scope, tag);
    for (const stage of p.stages) {
      const chip = el("a", "stage-chip", stage + " · " + stages[stage]);
      chip.href = "explore.html?stage=" + stage;
      chip.dataset.selectStage = stage;
      tags.append(chip);
    }
    if (!p.stages.length) tags.append(el("span", "support-chip", p.role));
    body.append(bottom, tags);
    card.append(body);
    return card;
  }
  function filteredBase() {
    return papers.filter(
      (p) =>
        (!state.task || p.task === state.task) &&
        (!state.scope || p.catalogueScope === state.scope) &&
        (!state.stage ||
          (state.stage === "supporting"
            ? !p.stages.length
            : p.stages.includes(state.stage))),
    );
  }
  function render(append = false) {
    const task = byTask.get(state.task),
      scopeIndex = scopes.indexOf(state.scope);
    $("#library-title").textContent = task
      ? task.id + " · " + task.title
      : state.scope
        ? "AI for " + state.scope
        : state.stage
          ? stages[state.stage] || "Research testbeds"
          : "Explore the literature.";
    $("#library-question").textContent =
      task?.question ||
      (state.scope
        ? "Browse the tasks and research within this manufacturing scope."
        : "Explore manufacturing tasks and AI stages. Combine filters to follow the questions that interest you.");
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
    document
      .querySelectorAll("[data-filter-stage]")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(b.dataset.filterStage === state.stage),
        ),
      );
    const active = $("#active-filters");
    active.replaceChildren();
    for (const [key, value, label] of [
      ["task", state.task, task?.title],
      ["scope", state.scope, state.scope],
      ["stage", state.stage, stages[state.stage] || "Research testbeds"],
      ["year", state.year, state.year],
    ]) {
      if (!value) continue;
      const b = el("button", "", label + " ×");
      b.setAttribute("aria-label", "Remove " + label + " filter");
      b.addEventListener("click", () => setState({ [key]: "" }));
      active.append(b);
    }
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
    if (!append) window.SurveyUI?.reveal(results, { y: 8, duration: 0.3 });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-select-task], [data-all-papers]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)
      return;
    e.preventDefault();
    setState({
      task: a.dataset.selectTask || "",
      scope: "",
      ...(a.hasAttribute("data-all-papers") ? { stage: "" } : {}),
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
  document
    .querySelectorAll("[data-filter-stage]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        setState({ stage: b.dataset.filterStage, year: "" }),
      ),
    );
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-select-stage]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)
      return;
    e.preventDefault();
    setState({ stage: a.dataset.selectStage, year: "" });
  });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-select-scope]");
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button)
      return;
    e.preventDefault();
    setState({ scope: a.dataset.selectScope, task: "", year: "" });
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
    setState({
      task: "",
      scope: "",
      stage: "",
      q: "",
      year: "",
      sort: "newest",
    });
    search.focus();
  });
  more.addEventListener("click", () => {
    const first = results.children.length;
    limit += 24;
    render(true);
    results.children[first]
      ?.querySelector(".paper-resource")
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
        (d) =>
          (d.open =
            !!state.task &&
            d.classList.contains(byTask.get(state.task)?.scope)),
      );
  render();
})();
