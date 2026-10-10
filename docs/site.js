/* Interaction and motion shared by the research guide and the reading library. */
(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let toastTimer;
  function toast(message) {
    const el = $(".toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
  }
  const running = new WeakMap();
  function reveal(el, options = {}) {
    if (!el || reduced.matches || !window.Motion) return;
    running.get(el)?.stop();
    const animation = Motion.animate(
      el,
      { opacity: [0.35, 1], y: [options.y ?? 12, 0] },
      { duration: 0.5, ease: [0.22, 1, 0.36, 1], ...options },
    );
    running.set(el, animation);
  }
  window.SurveyUI = { reveal, toast };
  if (window.Motion && !reduced.matches) {
    Motion.inView(
      ".section-heading, .journey, .stage-detail, .vision-sheet, .cite-card",
      (el) => {
        reveal(el, { y: 22, duration: 0.7 });
      },
    );
    Motion.inView(".map-wrap", (el) => {
      Motion.animate(
        el,
        { opacity: [0.2, 1], y: [48, 0], rotate: [-1.8, 0] },
        { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
      );
    });
    Motion.inView(".coverage", (el) => {
      reveal(el, { y: 35, duration: 0.85 });
      Motion.animate(
        $$(".matrix-cell", el),
        { opacity: [0, 1], scale: [0.6, 1] },
        {
          delay: Motion.stagger(0.025),
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        },
      );
    });
    if ($(".interlude"))
      Motion.scroll(
        Motion.animate(
          ".interlude",
          { x: [-10, 10], rotate: [-2.3, 0.8] },
          { ease: "linear" },
        ),
        { target: $(".interlude"), offset: ["start end", "end start"] },
      );
    reveal($(".hero-heading"), { duration: 0.8, y: 16 });
    reveal($(".hero-side"), { duration: 0.8, delay: 0.1, y: 14 });
  }
  // Decorative movement pauses out of view and respects the visitor's motion preference.
  const diagrams = $$(".atlas-path, .loop-line"),
    visible = new Set();
  function updateDiagrams() {
    diagrams.forEach((svg) => {
      if (reduced.matches || document.hidden || !visible.has(svg))
        svg.pauseAnimations?.();
      else svg.unpauseAnimations?.();
    });
  }
  const diagramObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) =>
      e.isIntersecting ? visible.add(e.target) : visible.delete(e.target),
    );
    updateDiagrams();
  });
  diagrams.forEach((svg) => diagramObserver.observe(svg));
  reduced.addEventListener("change", updateDiagrams);
  document.addEventListener("visibilitychange", updateDiagrams);
  function wireTabs(selector, change) {
    const tabs = $$(selector);
    if (!tabs.length) return;
    function activate(index, focus = false) {
      tabs.forEach((t, i) => {
        t.setAttribute("aria-selected", String(i === index));
        t.tabIndex = i === index ? 0 : -1;
      });
      const tab = tabs[index];
      if (focus) tab.focus({ preventScroll: true });
      const rail = tab.parentElement;
      if (rail.scrollWidth > rail.clientWidth)
        rail.scrollTo({
          left:
            tab.offsetLeft -
            rail.offsetLeft -
            rail.clientWidth / 2 +
            tab.clientWidth / 2,
          behavior: reduced.matches ? "instant" : "smooth",
        });
      change(index, tab);
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(index));
      tab.addEventListener("keydown", (e) => {
        let next;
        if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (e.key === "ArrowLeft")
          next = (index - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        if (next !== undefined) {
          e.preventDefault();
          activate(next, true);
        }
      });
    });
    return activate;
  }
  const steps = [
    [
      "Build the layers",
      "Deposit a thin film",
      "A thin layer of material is added to the wafer. Its thickness and uniformity influence the structures built in later steps.",
      "P2",
      "Virtual metrology",
      "P4",
      "Process control",
    ],
    [
      "Prepare the surface",
      "Coat with photoresist",
      "A light-sensitive film is spread over the wafer and baked. Its thickness and condition affect how the pattern will be transferred.",
      "P3",
      "Recipe optimization",
      "P1",
      "Process monitoring",
    ],
    [
      "Transfer the pattern",
      "Align and expose",
      "Light transfers a mask pattern to the photoresist. Mask design and exposure settings help determine the printed shape.",
      "A3",
      "Computational lithography",
      "A2",
      "Defect detection",
    ],
    [
      "Reveal the pattern",
      "Bake and develop",
      "After exposure and a further bake, development removes selected regions of resist to reveal the pattern.",
      "P3",
      "Recipe optimization",
      "P2",
      "Virtual metrology",
    ],
    [
      "Shape the material",
      "Etch, strip and clean",
      "Etching removes exposed material. The remaining resist and residues are then removed, leaving the patterned structure.",
      "P1",
      "Endpoint detection",
      "P4",
      "Process control",
    ],
    [
      "Connect the structures",
      "Fill and polish",
      "Metal fills the patterned features. Chemical mechanical polishing removes excess material and makes the surface flat for later layers.",
      "P2",
      "Virtual metrology",
      "P3",
      "Recipe optimization",
    ],
    [
      "Check the wafer",
      "Test before separation",
      "Electrical probes test individual dies on the wafer. The resulting measurements and failure patterns help assess quality and diagnose yield loss.",
      "A1",
      "Wafer patterns",
      "A6",
      "Adaptive testing",
    ],
    [
      "Separate the chips",
      "Thin, mount and dice",
      "The wafer is thinned as needed, mounted for handling and cut into individual dies. Inspection helps identify damage and defects.",
      "A2",
      "Defect detection",
      "A4",
      "Quality inference",
    ],
    [
      "Protect and connect",
      "Assemble the package",
      "Dies are attached, electrically connected and protected in a package. Assembly conditions influence the quality of the finished device.",
      "A4",
      "Quality inference",
      "A5",
      "Yield-loss diagnosis",
    ],
    [
      "Verify the product",
      "Test the finished device",
      "Final testing checks whether the packaged device meets its requirements. Test results also provide feedback for manufacturing decisions.",
      "A6",
      "Adaptive testing",
      "A5",
      "Yield-loss diagnosis",
    ],
  ];
  let currentStep = 0;
  const activateStep = wireTabs("[data-step]", (index, tab) => {
    currentStep = index;
    const [label, title, body, t1, l1, t2, l2] = steps[index];
    const pane = $("#step-detail");
    pane.setAttribute("aria-labelledby", tab.id);
    $(".step-number").textContent = String(index + 1).padStart(2, "0");
    $(".step-copy .eyebrow").textContent = label;
    $(".step-copy h3").textContent = title;
    $(".step-copy>p:last-child").textContent = body;
    $$(".step-tasks>a").forEach((a, i) => {
      a.href = "explore.html?task=" + (i ? t2 : t1);
      a.textContent = (i ? t2 : t1) + " · " + (i ? l2 : l1) + " ↗";
    });
    reveal($(".step-copy"), { y: 8 });
    reveal($(".step-tasks"), { y: 6, delay: 0.04 });
    const panorama = $(".journey-window");
    if (panorama.scrollWidth > panorama.clientWidth)
      panorama.scrollTo({
        left: ((panorama.scrollWidth - panorama.clientWidth) * index) / 9,
        behavior: reduced.matches ? "instant" : "smooth",
      });
  });
  $(".next-step")?.addEventListener("click", () =>
    activateStep((currentStep + 1) % steps.length),
  );
  const stages = [
    [
      "Perception",
      "What is happening?",
      "Recognize patterns, defects and operating states in images or sensor data.",
      "Locate a defect in an inspection image, or recognize a spatial failure pattern on a wafer.",
      "Observe → Recognize",
      "A2",
      "Explore defect detection",
    ],
    [
      "Prediction",
      "What is likely to happen?",
      "Estimate an unmeasured property or a future outcome from the available observations.",
      "Use equipment sensor signals to estimate a wafer measurement before physical metrology becomes available.",
      "Observe → Estimate",
      "P2",
      "Explore virtual metrology",
    ],
    [
      "Reasoning",
      "Why did it happen?",
      "Connect observations with process knowledge to investigate causes and explain results.",
      "Combine wafer patterns, process histories and physical knowledge to distinguish possible causes of yield loss.",
      "Evidence → Explanation",
      "A5",
      "Explore yield-loss diagnosis",
    ],
    [
      "Planning",
      "What should happen next?",
      "Choose actions that account for objectives, constraints and their expected consequences.",
      "Decide which lots each tool should process, while accounting for shared resources and delivery targets.",
      "Consequences → Decisions",
      "R2",
      "Explore scheduling",
    ],
    [
      "Autonomy",
      "How can action improve with experience?",
      "Connect observations and decisions to execution, then use the resulting feedback to improve subsequent actions.",
      "A control system adjusts process settings and uses later measurements to update its next correction.",
      "Decide → Act → Learn",
      "P4",
      "Explore feedback control",
    ],
  ];
  let currentStage = 0,
    stageTimer;
  const stopStageTour = () => {
    clearInterval(stageTimer);
    stageTimer = undefined;
    const button = $(".play-stages");
    if (button) {
      button.setAttribute("aria-pressed", "false");
      button.innerHTML =
        '<span aria-hidden="true">▶</span> Play the progression';
    }
  };
  const activateStage = wireTabs("[data-stage]", (index, tab) => {
    currentStage = index;
    const [name, title, body, example] = stages[index];
    $("#stage-detail").setAttribute("aria-labelledby", tab.id);
    $(".robot-strip").style.setProperty("--active-part", index);
    $(".stage-index").textContent = String(index + 1).padStart(2, "0");
    $(".stage-copy .eyebrow").textContent = "L" + (index + 1) + " / " + name;
    $(".stage-copy h3").textContent = title;
    $(".stage-copy>p:not(.eyebrow)").textContent = body;
    $(".stage-example>p").textContent = example;
    const a = $(".stage-library");
    a.href = "explore.html?stage=L" + (index + 1);
    a.textContent = "Explore " + name + " papers ↗";
    $$(".robot-hotspot").forEach((b, i) =>
      b.setAttribute("aria-pressed", String(i === index)),
    );
    const rail = $(".robot-scroll"),
      strip = $(".robot-strip");
    if (rail.scrollWidth > rail.clientWidth)
      rail.scrollTo({
        left: Math.max(
          0,
          (strip.clientWidth * (index + 0.5)) / 5 - rail.clientWidth / 2,
        ),
        behavior: reduced.matches ? "instant" : "smooth",
      });
    reveal($(".stage-copy"), { y: 12, duration: 0.5 });
    reveal($(".stage-example"), { y: 8, delay: 0.06 });
  });
  $$("[data-robot]").forEach((b) =>
    b.addEventListener("click", () => activateStage(Number(b.dataset.robot))),
  );
  if (activateStage) activateStage(0);
  $(".play-stages")?.addEventListener("click", () => {
    if (stageTimer) return stopStageTour();
    if (currentStage === 4) activateStage(0);
    const button = $(".play-stages");
    button.setAttribute("aria-pressed", "true");
    button.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause progression';
    stageTimer = setInterval(
      () =>
        currentStage === 4 ? stopStageTour() : activateStage(currentStage + 1),
      5500,
    );
  });
  $$("[data-stage],[data-robot]").forEach((button) => {
    button.addEventListener("pointerdown", stopStageTour);
    button.addEventListener("keydown", stopStageTour);
  });
  if ($("#stages"))
    new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) stopStageTour();
    }).observe($("#stages"));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopStageTour();
  });
  const catalogue = window.MANUFACTURING_CATALOGUE;
  if ($(".coverage-matrix") && catalogue) {
    const { papers, stages: stageNames, coverage } = catalogue;
    const names = ["Artifacts", "Processes", "Equipment", "Production", "Fabs"];
    const icons = [
      "artifact_wide",
      "process",
      "equipment",
      "production",
      "fab_vertical",
    ];
    const colors = ["#cbb0eb", "#c5d599", "#efbd8c", "#9ccfd8", "#a7bce7"];
    const matrix = $("#coverage-matrix");
    const node = (tag, cls, txt) => {
      const n = document.createElement(tag);
      n.className = cls;
      if (txt !== undefined) n.textContent = txt;
      return n;
    };
    matrix.append(node("div", "matrix-corner", "MANUFACTURING / AI"));
    Object.entries(stageNames).forEach(([k, name]) => {
      const h = node("a", "matrix-heading");
      h.href = "explore.html?stage=" + k;
      h.append(node("small", "", k), document.createTextNode(name));
      matrix.append(h);
    });
    coverage.forEach((row, i) => {
      const label = node("a", "matrix-row");
      label.href = "explore.html?scope=" + row.scope;
      const icon = node("img", "");
      icon.src = "assets/icons/" + icons[i] + ".png";
      icon.alt = "";
      icon.width = 35;
      icon.height = 39;
      const text = node("span", "", names[i]);
      text.append(node("small", "", row.total + " papers"));
      label.append(icon, text);
      matrix.append(label);
      Object.entries(row.counts).forEach(([stage, count]) => {
        const a = node("a", "matrix-cell");
        a.href = "explore.html?scope=" + row.scope + "&stage=" + stage;
        a.dataset.count = count;
        a.dataset.share = (count / row.total) * 100;
        a.dataset.scope = row.scope;
        a.dataset.stage = stage;
        a.style.setProperty("--bubble", colors[i]);
        a.append(node("span", "", ""));
        const description =
          names[i] +
          " × " +
          stageNames[stage] +
          ": " +
          count +
          " of " +
          row.total +
          " papers (" +
          ((count / row.total) * 100).toFixed(1) +
          "%).";
        a.setAttribute("aria-label", description + " Browse papers.");
        ["mouseenter", "focus"].forEach((evt) =>
          a.addEventListener(
            evt,
            () => ($("#coverage-readout").textContent = description),
          ),
        );
        matrix.append(a);
      });
    });
    const maxCount = Math.max(
      ...coverage.flatMap((r) => Object.values(r.counts)),
    );
    function changeUnit(unit) {
      $$("[data-unit]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.unit === unit)),
      );
      $$(".matrix-cell").forEach((a) => {
        const value = Number(a.dataset[unit]),
          fraction = unit === "share" ? value / 100 : value / maxCount;
        const size = 72 * Math.sqrt(fraction);
        a.style.setProperty("--size", Math.max(5, size) + "px");
        a.classList.toggle("small-value", size < 31);
        a.firstChild.textContent =
          unit === "share" ? Math.round(value) + "%" : value;
      });
      $(".size-key").lastChild.textContent =
        " Circle area = " +
        (unit === "share" ? "share of scope" : "paper count");
    }
    $$("[data-unit]").forEach((b) =>
      b.addEventListener("click", () => changeUnit(b.dataset.unit)),
    );
    changeUnit("share");
    const counts = new Map();
    papers.forEach((p) => counts.set(p.year, (counts.get(p.year) || 0) + 1));
    const years = [...counts.keys()].sort((a, b) => a - b),
      max = Math.max(...counts.values());
    for (let year = years[0]; year <= years.at(-1); year++) {
      const count = counts.get(year) || 0,
        a = node("a", "year-bar");
      a.href = "explore.html?year=" + year;
      a.style.setProperty("--share", count / max);
      a.setAttribute(
        "aria-label",
        year + ": " + count + " papers. Browse papers.",
      );
      a.append(
        node("span", "year-value", count),
        node("span", "bar"),
        node(
          "span",
          "year-label",
          year % 2 === 0 || year === years.at(-1) ? year : "",
        ),
      );
      $("#timeline-chart").append(a);
    }
    wireTabs("[data-chart]", (i) => {
      $("#scope-chart").hidden = i !== 0;
      $("#year-chart").hidden = i !== 1;
      $(".chart-unit").hidden = i !== 0;
      reveal($(i ? "#year-chart" : "#scope-chart"), { y: 10 });
    });
  }
  if (catalogue)
    $$(".figure-hotspot").forEach((a) => {
      const t = catalogue.tasks.find((t) => t.id === a.dataset.task);
      ["mouseenter", "focus"].forEach((evt) =>
        a.addEventListener(
          evt,
          () => ($("#map-selection").textContent = t.id + " · " + t.title),
        ),
      );
      a.addEventListener(
        "mouseleave",
        () => ($("#map-selection").textContent = "Choose a manufacturing task"),
      );
    });
  // Small spring-like magnetic feedback stays outside the figure coordinate system.
  if (matchMedia("(pointer:fine)").matches) {
    $$(".button, .round-stamp").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        if (reduced.matches) return;
        const r = el.getBoundingClientRect();
        el.style.translate =
          (e.clientX - r.left - r.width / 2) * 0.09 +
          "px " +
          (e.clientY - r.top - r.height / 2) * 0.14 +
          "px";
      });
      el.addEventListener("pointerleave", () => (el.style.translate = "0 0"));
    });
  }
  const dialog = $(".diagram-dialog");
  $$("[data-open-diagram]").forEach((button) =>
    button.addEventListener("click", () => {
      const vision = button.dataset.openDiagram === "vision";
      $(".diagram-scroll img").src = vision
        ? "assets/web/virtual-fab.webp"
        : "assets/overview.jpg";
      $(".diagram-scroll img").alt = vision
        ? "AI-native autonomous virtual fab diagram"
        : "Manufacturing tasks and AI stages diagram";
      $("#diagram-title").textContent = vision
        ? "AI-native autonomous virtual fab"
        : "Manufacturing tasks & AI stages";
      dialog.showModal();
      document.body.style.overflow = "hidden";
      reveal(dialog, { y: 15, duration: 0.3 });
    }),
  );
  $(".close-dialog")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
  dialog?.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
  $("[data-copy-citation]")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("#bibtex").textContent);
      toast("BibTeX copied.");
    } catch {
      $("#bibtex").closest("details").open = true;
      const range = document.createRange();
      range.selectNodeContents($("#bibtex"));
      getSelection().removeAllRanges();
      getSelection().addRange(range);
      toast("BibTeX selected. Press Ctrl+C or ⌘C to copy.");
    }
  });
})();
