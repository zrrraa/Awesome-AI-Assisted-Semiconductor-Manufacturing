/* Interaction and motion shared by the atlas and the reading library. */
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
  window.AtlasUI = { reveal, toast };
  if (window.Motion && !reduced.matches) {
    Motion.inView(
      ".section-heading, .journey, .stage-detail, .vision, .cite-card",
      (el) => {
        reveal(el, { y: 22, duration: 0.7 });
      },
    );
    Motion.inView(".insight-grid", (el) => {
      $$(".insight-card", el).forEach((card, i) =>
        reveal(card, { delay: i * 0.08, y: 18 }),
      );
    });
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
  wireTabs("[data-stage]", (index, tab) => {
    const [name, title, body, example, label, task, link] = stages[index];
    $("#stage-detail").setAttribute("aria-labelledby", tab.id);
    // The five scenes share one continuous illustration, with unequal widths.
    const slices = [
      [0, 0.22],
      [0.1833, 0.25],
      [0.3861, 0.22],
      [0.5639, 0.225],
      [0.75, 0.25],
    ];
    $(".stage-visual").style.setProperty("--strip-start", slices[index][0]);
    $(".stage-visual").style.setProperty("--strip-slice", slices[index][1]);
    $(".stage-giant").textContent = String(index + 1).padStart(2, "0");
    $(".stage-mini-label").textContent = label;
    $(".stage-copy .eyebrow").textContent = "L" + (index + 1) + " / " + name;
    $(".stage-copy h3").textContent = title;
    $(".stage-copy>p:not(.eyebrow)").textContent = body;
    $(".stage-example>p").textContent = example;
    const a = $(".stage-copy>.text-link");
    a.href = "explore.html?task=" + task;
    a.textContent = link + " ↗";
    reveal($(".stage-copy"), { y: 10, duration: 0.45 });
  });
  const dialog = $(".diagram-dialog");
  $("[data-open-diagram]")?.addEventListener("click", () => {
    dialog.showModal();
    document.body.style.overflow = "hidden";
    reveal(dialog, { y: 15, duration: 0.3 });
  });
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
