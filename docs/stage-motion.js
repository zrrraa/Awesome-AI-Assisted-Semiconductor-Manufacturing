/* The original illustration stays intact; its instruments and data paths come alive. */
(() => {
  "use strict";
  const illustration = document.querySelector(".stage-illustration");
  if (!illustration) return;
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 2048 296");
  svg.setAttribute("class", "stage-motion");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const animate = (attribute, values, duration, phase = 0, times = "") =>
    `<animate attributeName="${attribute}" values="${values}" dur="${duration}s"
      begin="-${phase}s" repeatCount="indefinite" ${times ? `keyTimes="${times}"` : ""}/>`;
  const travel = (path, duration, phase = 0) =>
    `<animateMotion path="${path}" dur="${duration}s" begin="-${phase}s"
      repeatCount="indefinite" calcMode="paced"/>`;
  const bead = (path, color, duration, phase = 0, radius = 5) =>
    `<g>${travel(path, duration, phase)}
      <circle r="${radius + 4}" fill="${color}" opacity=".18"/>
      <circle r="${radius}" fill="${color}" stroke="#fff" stroke-width="2"/>
    </g>`;
  const stream = (path, color, duration, phase = 0) =>
    `<path d="${path}" fill="none" stroke="${color}" stroke-width="5"
      stroke-linecap="round" pathLength="100" stroke-dasharray="7 93" opacity=".8">
      ${animate("stroke-dashoffset", "0;-100", duration, phase)}
    </path>`;
  const draw = (path, color, duration, phase = 0, width = 4) =>
    `<path d="${path}" fill="none" stroke="${color}" stroke-width="${width}"
      stroke-linecap="round" stroke-linejoin="round" pathLength="100" stroke-dasharray="100">
      ${animate("stroke-dashoffset", "100;100;0;0;0", duration, phase, "0;.08;.55;.84;1")}
      ${animate("opacity", "0;1;1;1;0", duration, phase, "0;.08;.55;.84;1")}
    </path>`;
  const ring = (x, y, color, phase, duration = 4.8) =>
    `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="${color}" stroke-width="2.5">
      ${animate("r", "6;6;22;26", duration, phase, "0;.45;.8;1")}
      ${animate("opacity", "0;.9;.3;0", duration, phase, "0;.45;.8;1")}
    </circle>`;
  const packet = (path, duration, phase) =>
    `<g>${travel(path, duration, phase)}
      <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#fff6cf" stroke="#ed9b37" stroke-width="2"/>
      <path d="M-3 0h6M0-3v6" stroke="#ed9b37" stroke-width="1.5"/>
    </g>`;

  const forecast = "M562 183 C597 183 623 169 646 153 S737 121 791 125";
  const upperForecast = "M645 153 C712 96 764 67 817 60";
  const lowerForecast = "M645 153 C707 147 764 162 817 169";
  const inputs = [
    "M883 111 C928 116 979 129 1014 153",
    "M914 169 C960 168 986 171 1019 176",
    "M925 220 C964 219 994 205 1020 196",
  ];
  const command = "M1675 178 C1723 174 1781 205 1848 200 L1870 187";
  const feedback = "M1871 204 C1860 253 1766 276 1646 256 C1550 240 1517 213 1443 216";

  svg.innerHTML = `
    <defs>
      <clipPath id="motion-wafer"><ellipse cx="211" cy="192" rx="167" ry="46"/></clipPath>
      <clipPath id="motion-lens"><ellipse cx="266" cy="133" rx="48" ry="32" transform="rotate(-43 266 133)"/></clipPath>
      <linearGradient id="motion-scan">
        <stop stop-color="#89f8ff" stop-opacity="0"/>
        <stop offset=".6" stop-color="#ecffff" stop-opacity=".7"/>
        <stop offset="1" stop-color="#26bbef" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="motion-heat" x1="0" y1="1" x2="0" y2="0">
        <stop stop-color="#ffbf57" stop-opacity=".9"/>
        <stop offset="1" stop-color="#ffb637" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <g data-action="perception">
      <g clip-path="url(#motion-wafer)">
        <g>
          <animateTransform attributeName="transform" type="translate" values="-110 0;325 0;325 0" keyTimes="0;.8;1" dur="4.8s" repeatCount="indefinite"/>
          <path d="M10 134h83l95 115h-83Z" fill="url(#motion-scan)"/>
          <path d="m62 137 96 112" fill="none" stroke="#d8ffff" stroke-width="3" opacity=".85"/>
        </g>
      </g>
      <g fill="none" stroke="#f9a232" stroke-width="3" transform="skewX(-32)">
        <rect x="236" y="181" width="29" height="20" rx="2">
          ${animate("opacity", "0;0;1;1;0", 4.8, 0, "0;.25;.3;.64;1")}
        </rect>
        <rect x="319" y="208" width="26" height="18" rx="2">
          ${animate("opacity", "0;0;1;1;0", 4.8, 0, "0;.48;.53;.75;1")}
        </rect>
        <rect x="392" y="173" width="27" height="20" rx="2">
          ${animate("opacity", "0;0;1;1;0", 4.8, 0, "0;.66;.71;.88;1")}
        </rect>
      </g>
      <g clip-path="url(#motion-lens)">
        <path d="M203 86h20l94 107h-20Z" fill="white" opacity=".5">
          <animateTransform attributeName="transform" type="translate" values="-85 0;85 0;85 0" keyTimes="0;.65;1" dur="4.8s" repeatCount="indefinite"/>
        </path>
      </g>
    </g>

    <g data-action="prediction">
      ${draw(forecast, "#127ac0", 5.6, 1, 4.5)}
      ${draw(upperForecast, "#45b8ed", 5.6, 1, 2.5)}
      ${draw(lowerForecast, "#45b8ed", 5.6, 1, 2.5)}
      ${bead(forecast, "#09bfe8", 5.6, 1, 6)}
      ${ring(790, 125, "#339ddb", 1.8, 5.6)}
    </g>

    <g data-action="reasoning">
      ${inputs.map((p, i) => stream(p, "#9b75df", 4.5, i * 1.5) + bead(p, "#9570de", 4.5, i * 1.5, 4)).join("")}
      <ellipse cx="1080" cy="186" rx="29" ry="18" fill="url(#motion-heat)">
        ${animate("opacity", ".05;.55;.05", 4.5, .8)}
      </ellipse>
      ${[1055, 1077, 1098].map((x, i) => `<path d="M${x} 166c-9-8 9-13 0-23" fill="none" stroke="#ffab36" stroke-width="3" stroke-linecap="round">
        ${animate("opacity", ".2;1;.2", 2.4, i * .8)}
        <animateTransform attributeName="transform" type="translate" values="0 3;0 -5;0 3" dur="2.4s" begin="-${i * .8}s" repeatCount="indefinite"/>
      </path>`).join("")}
      ${draw("M1060 200l12 10 24-26", "#ffc956", 4.5, .8, 4)}
    </g>

    <g data-action="planning">
      <g transform="rotate(-12 1303 203)">
        <rect x="1264" y="180" width="78" height="43" rx="5" fill="#c3f4ff" fill-opacity=".08" stroke="#51add7" stroke-width="3">
          ${animate("opacity", ".15;.85;.15;.15", 6, 0, "0;.2;.35;1")}
        </rect>
      </g>
      <g transform="rotate(-17 1390 188)">
        <rect x="1353" y="167" width="73" height="43" rx="5" fill="none" stroke="#51add7" stroke-width="3">
          ${animate("opacity", ".15;.15;.85;.15;.15", 6, 0, "0;.2;.4;.55;1")}
        </rect>
      </g>
      <g transform="rotate(8 1454 124)">
        <rect x="1409" y="98" width="91" height="53" rx="6" fill="#fff0ba" fill-opacity=".12" stroke="#f5a32a" stroke-width="3">
          ${animate("opacity", ".12;.12;1;1;.12", 6, 0, "0;.4;.5;.85;1")}
        </rect>
      </g>
      ${draw("M1288 205h29 M1380 181h25 M1434 115l12 10 27-8", "#ffb233", 6, 0, 4)}
      ${ring(1443, 113, "#ffbb45", 2.3, 6)}
    </g>

    <g data-action="autonomy">
      ${stream(command, "#ffc05f", 4.6)}
      ${packet(command, 4.6, 0)}
      <path d="M1872 109h79v52h-79Z" fill="url(#motion-heat)">
        ${animate("opacity", ".05;.6;.05", 4.6, 1.7)}
      </path>
      <ellipse cx="1873" cy="179" rx="28" ry="8" fill="none" stroke="#ffd879" stroke-width="3">
        ${animate("opacity", ".1;.85;.1", 4.6, 1.7)}
      </ellipse>
      ${stream(feedback, "#34c1dd", 4.6, 2.3)}
      ${bead(feedback, "#21b4d5", 4.6, 2.3, 5)}
      ${draw("M1600 242c14-4 22-7 28-20s10-12 14 0 12 20 28 11", "#3397e1", 4.6, 2.3, 3.5)}
    </g>

    <g data-action="data-flow">
      ${[
        ["M388 128 C445 139 493 218 554 202", 0],
        ["M734 198 C777 191 804 184 829 185", 1.2],
        ["M1140 179 C1178 181 1198 213 1230 223", 2.4],
        ["M1515 144 C1547 146 1571 154 1592 158", 3.6],
      ].map(([p, phase]) => stream(p, "#c6ffff", 3.8, phase) + packet(p, 3.8, phase)).join("")}
    </g>`;
  illustration.append(svg);

  // One SVG clock keeps every loop in phase. Freeze it offscreen without
  // resetting; returning to the illustration resumes the same activity.
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let inView = false;
  const update = () => {
    const playing = inView && !document.hidden && !reduced.matches;
    if (playing) svg.unpauseAnimations();
    else svg.pauseAnimations();
    svg.dataset.playing = String(playing);
  };
  svg.pauseAnimations();
  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    update();
  }, { threshold: 0.05 }).observe(illustration);
  document.addEventListener("visibilitychange", update);
  reduced.addEventListener("change", update);
})();
