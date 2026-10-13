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
  // Decode the figure before playing its original tilted entrance. Animate one
  // composited transform rather than rotating a partly decoded bitmap.
  const overview = $(".map-wrap");
  const overviewImage = $(".original-map > img");
  const overviewReady = overviewImage?.decode().catch(() => {});
  if (overviewImage) {
    // Reuse the browser-selected bitmap for every hotspot, including after resize.
    const syncHotspotImage = () => overviewImage.parentElement.style.setProperty(
      "--overview-image", `url("${overviewImage.currentSrc || overviewImage.src}")`,
    );
    overviewImage.addEventListener("load", syncHotspotImage);
    if (overviewImage.complete) syncHotspotImage();
  }
  if (window.Motion && !reduced.matches) {
    Motion.inView(
      ".section-heading, .stage-detail, .vision-loop, .cite-card",
      (el) => {
        reveal(el, { y: 22, duration: 0.7 });
      },
    );
    if (overview) {
      overview.style.opacity = "0";
      overview.style.willChange = "transform, opacity";
      Motion.inView(overview, () => {
        Promise.resolve(overviewReady).then(() => {
          if (reduced.matches) {
            overview.style.opacity = "";
            overview.style.willChange = "";
            return;
          }
          const entrance = overview.animate([
            { opacity: 0.2, transform: "translateY(48px) rotate(-1.8deg)" },
            { opacity: 1, transform: "translateY(0) rotate(0deg)" },
          ], { duration: 1100, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
          overview.style.opacity = "";
          entrance.onfinish = () => { overview.style.willChange = ""; };
        });
      });
    }
    const journey = $(".journey");
    if (journey) {
      Motion.inView(journey, () => {
        $(".panorama > img", journey).decode().catch(() => {}).then(() => {
          if (reduced.matches) return;
          // Keep the illustration opaque: only its position changes on entry.
          journey.animate([
            { transform: "translateY(22px)" },
            { transform: "translateY(0)" },
          ], { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
        });
      });
    }
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
      "What can we estimate?",
      "Estimate an unmeasured property or a future outcome from the available observations.",
      "Use equipment sensor signals to estimate a wafer measurement before physical metrology becomes available.",
      "Observe → Estimate",
      "P2",
      "Explore virtual metrology",
    ],
    [
      "Reasoning",
      "Which explanation fits the evidence?",
      "Use observations and knowledge to compare explanations and choose evidence that can distinguish them.",
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
      "Execute decisions, observe their effects and adjust subsequent actions within the system’s operating scope.",
      "A control system adjusts process settings and uses later measurements to update its next correction.",
      "Decide → Act → Learn",
      "P4",
      "Explore feedback control",
    ],
  ];
  // Boundaries follow complete illustrated scenes in the continuous source image.
  const stageBounds = [0, 20.1, 40.6, 56.4, 76.5, 100];
  const activateStage = wireTabs("[data-stage]", (index, tab) => {
    const [name, title, body, example] = stages[index];
    $("#stage-detail").setAttribute("aria-labelledby", tab.id);
    $(".robot-strip").style.setProperty(
      "--stage-left",
      stageBounds[index] + "%",
    );
    $(".robot-strip").style.setProperty(
      "--stage-width",
      stageBounds[index + 1] - stageBounds[index] + "%",
    );
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
    const rail = $(".stage-visual-scroll"),
      strip = $(".robot-strip");
    if (rail.scrollWidth > rail.clientWidth)
      rail.scrollTo({
        left: Math.max(
          0,
          (strip.clientWidth * (stageBounds[index] + stageBounds[index + 1])) /
            200 -
            rail.clientWidth / 2,
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
    const stageKey = node("div", "matrix-stage-key");
    Object.entries(stageNames).forEach(([k, name]) => {
      const h = node("a", "matrix-heading");
      h.href = "explore.html?stage=" + k;
      h.append(node("small", "", k), document.createTextNode(name));
      stageKey.append(h);
    });
    matrix.append(stageKey);
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
        a.style.setProperty("--fraction", Math.sqrt(fraction));
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
    const years = papers.map((p) => p.year),
      firstYear = Math.min(...years),
      lastYear = Math.max(...years);
    const scopeKeys = coverage.map((r) => r.scope);
    const stageColors = ["#87c9dc", "#bba4eb", "#efc678", "#e9a5b7", "#a5cfb1"];
    function renderTimeline(mode) {
      $$("[data-timeline]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.timeline === mode)),
      );
      const groups =
        mode === "scope"
          ? scopeKeys.map((key, i) => ({
              key,
              label: "M" + (i + 1) + " · " + names[i],
              color: colors[i],
            }))
          : mode === "stage"
            ? Object.entries(stageNames).map(([key, label], i) => ({
                key,
                label: key + " · " + label,
                color: stageColors[i],
              }))
            : [{ key: "total", label: "All papers", color: "#c6a9e2" }];
      const rows = [];
      for (let year = firstYear; year <= lastYear; year++) {
        const matches = papers.filter((p) => p.year === year);
        const values = groups.map(
          (g) =>
            matches.filter((p) =>
              mode === "scope"
                ? p.catalogueScope === g.key
                : mode === "stage"
                  ? p.stages.includes(g.key)
                  : true,
            ).length,
        );
        rows.push({
          year,
          values,
          total: values.reduce((a, b) => a + b, 0),
          paperCount: matches.length,
        });
      }
      const max = Math.max(...rows.map((r) => r.total));
      const chart = $("#timeline-chart"),
        legend = $("#timeline-legend");
      chart.replaceChildren();
      legend.replaceChildren();
      chart.dataset.mode = mode;
      chart.style.setProperty("--year-count", rows.length);
      groups.forEach((g) => {
        const label = node("span", "");
        const swatch = node("i", "");
        swatch.style.setProperty("--segment", g.color);
        label.append(swatch, document.createTextNode(g.label));
        legend.append(label);
      });
      $("#timeline-measure").textContent =
        mode === "stage" ? "Stage assignments" : "Papers";
      $("#timeline-maximum").textContent = "Highest count · " + max;
      $("#timeline-note").textContent =
        mode === "stage"
          ? "A paper contributes to every stage it addresses. The three testbed papers without a stage are omitted in this view."
          : "Each paper is counted once, using its publication year" +
            (mode === "scope" ? " and manufacturing scope." : ".");
      $("#timeline-readout").textContent =
        "Select " +
        (mode === "total" ? "a bar" : "a colored segment") +
        " to browse the matching papers.";
      rows.forEach((row) => {
        const column = node("div", "year-bar" + (row.total ? "" : " zero"));
        column.dataset.year = row.year;
        column.dataset.total = row.total;
        column.style.setProperty("--share", row.total / max);
        const stack = node("div", "bar-stack");
        row.values.forEach((count, i) => {
          if (!count) return;
          const g = groups[i],
            a = node("a", "year-segment");
          a.href =
            "explore.html?year=" +
            row.year +
            (mode === "scope"
              ? "&scope=" + g.key
              : mode === "stage"
                ? "&stage=" + g.key
                : "");
          a.dataset.group = g.key;
          a.dataset.count = count;
          a.style.setProperty("--segment-share", count / row.total);
          a.style.setProperty("--segment", g.color);
          const label =
            row.year +
            " · " +
            g.label +
            " · " +
            count +
            " " +
            (count === 1 ? "paper" : "papers");
          a.setAttribute("aria-label", label + ". Browse papers.");
          a.title = label;
          ["mouseenter", "focus"].forEach((event) =>
            a.addEventListener(event, () => {
              $("#timeline-readout").textContent =
                label +
                (mode === "stage"
                  ? " · " + row.paperCount + " papers in this year"
                  : "");
            }),
          );
          stack.append(a);
        });
        column.append(
          node("span", "year-value", row.total),
          stack,
          node(
            "span",
            "year-label",
            row.year,
          ),
        );
        chart.append(column);
      });
      if (!reduced.matches && window.Motion)
        Motion.animate(
          $$(".bar-stack"),
          { [matchMedia("(max-width: 640px)").matches ? "scaleX" : "scaleY"]: [0.2, 1], opacity: [0.45, 1] },
          {
            duration: 0.6,
            delay: Motion.stagger(0.008),
            ease: [0.22, 1, 0.36, 1],
          },
        );
    }
    $$("[data-timeline]").forEach((b) =>
      b.addEventListener("click", () => renderTimeline(b.dataset.timeline)),
    );
    renderTimeline("total");
    wireTabs("[data-chart]", (i) => {
      $("#scope-chart").hidden = i !== 0;
      $("#year-chart").hidden = i !== 1;
      $(".chart-unit").hidden = i !== 0;
      $(".coverage-stage-note").hidden = i !== 0;
      $(".coverage-bottom a").href = i
        ? "assets/timeline.csv"
        : "assets/coverage.csv";
      reveal($(i ? "#year-chart" : "#scope-chart"), { y: 10 });
    });
  }
  if (catalogue && $(".map-peek")) {
    const taskIcons = [
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
    const peek = $(".map-peek"),
      map = $(".map-wrap");
    // Decode each icon in advance. Switching existing nodes never paints the
    // previous task's bitmap while a new src is still loading.
    const iconSlot = document.createElement("span");
    iconSlot.className = "map-peek-icons";
    const peekIcons = taskIcons.map((name) => {
      const icon = new Image(61, 69);
      icon.alt = "";
      icon.hidden = true;
      icon.decoding = "async";
      icon.src = "assets/icons/" + name + ".png";
      iconSlot.append(icon);
      icon.decode().catch(() => {});
      return icon;
    });
    const stagePortraits = [
      [75, 0, 290, 230], [455, 5, 255, 220], [920, 0, 225, 200],
      [1190, 10, 270, 220], [1570, 5, 280, 230],
    ].map((box) => {
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", box.join(" "));
      icon.setAttribute("aria-hidden", "true");
      icon.setAttribute("hidden", "");
      const picture = document.createElementNS("http://www.w3.org/2000/svg", "image");
      picture.setAttribute("href", "assets/web/stages.webp");
      picture.setAttribute("width", "2048");
      picture.setAttribute("height", "296");
      icon.append(picture);
      iconSlot.append(icon);
      return icon;
    });
    const stageImage = new Image();
    stageImage.src = "assets/web/stages.webp";
    stageImage.decode().catch(() => {});
    $("img", peek).replaceWith(iconSlot);
    const allPeekIcons = [...peekIcons, ...stagePortraits];
    const showPeek = (anchor, id, label, title, description, icon) => {
      allPeekIcons.forEach((node) => node.toggleAttribute("hidden", node !== icon));
      peek.dataset.task = id;
      $("#map-selection").textContent = id + " · " + title;
      $("small", peek).textContent = label;
      $("b", peek).textContent = title;
      $("p", peek).textContent = description;
      const r = anchor.getBoundingClientRect(), m = map.getBoundingClientRect();
      peek.style.left = Math.max(20, Math.min(
        r.left - m.left + r.width / 2 - peek.offsetWidth / 2,
        m.width - peek.offsetWidth - 20,
      )) + "px";
      const below = r.bottom - m.top + 18;
      peek.style.top = (below + peek.offsetHeight < m.height - 20
        ? below : Math.max(20, r.top - m.top - peek.offsetHeight - 18)) + "px";
      peek.classList.add("visible");
    };
    const hidePeek = () => {
      peek.classList.remove("visible");
      $("#map-selection").textContent = "Explore a task or an AI stage";
    };
    const peekHandlers = new Map();
    const bindPeek = (anchor, show) => {
      peekHandlers.set(anchor, show);
      anchor.addEventListener("mouseenter", show);
      anchor.addEventListener("focus", show);
      anchor.addEventListener("mouseleave", () => {
        const focused = peekHandlers.get(document.activeElement);
        if (focused) focused();
        else hidePeek();
      });
      anchor.addEventListener("blur", () => {
        if (!anchor.matches(":hover")) hidePeek();
      });
    };
    window.addEventListener("resize", () => {
      const focused = peekHandlers.get(document.activeElement);
      if (focused) focused();
      else hidePeek();
    });
    const addFigureCrop = (a) => {
      const left = parseFloat(a.style.left),
        top = parseFloat(a.style.top),
        width = parseFloat(a.style.width),
        height = parseFloat(a.style.height);
      const art = document.createElement("div");
      art.className = "hotspot-art";
      art.setAttribute("aria-hidden", "true");
      art.style.backgroundSize = 10000 / width + "% " + 10000 / height + "%";
      art.style.backgroundPosition =
        (left / (100 - width)) * 100 +
        "% " +
        (top / (100 - height)) * 100 +
        "%";
      a.prepend(art);
    };
    $$(".figure-hotspot").forEach((a) => {
      const index = catalogue.tasks.findIndex((t) => t.id === a.dataset.task),
        t = catalogue.tasks[index];
      addFigureCrop(a);
      bindPeek(a, () => showPeek(a, t.id, t.id + " / " + t.scope.toUpperCase(),
        t.title, t.question, peekIcons[index]));
    });
    $$(".pipe-hotspot").forEach((a) => {
      addFigureCrop(a);
      const index = Number(a.dataset.stageIndex), id = "L" + (index + 1);
      bindPeek(a, () => showPeek(a, id, id + " / AI STAGE", stages[index][0],
        stages[index][2], stagePortraits[index]));
    });
  }
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
      const image = $(".diagram-scroll img", dialog);
      if (!image.getAttribute("src")) image.src = image.dataset.src;
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
