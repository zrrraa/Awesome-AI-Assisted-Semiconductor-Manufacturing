/* Image-generated poses share one playback clock across all five stage regions. */
(() => {
  "use strict";
  const illustration = document.querySelector(".stage-illustration");
  if (!illustration) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const video = document.createElement("video");
  video.className = "stage-motion";
  video.setAttribute("aria-hidden", "true");
  video.setAttribute("tabindex", "-1");
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;
  video.preload = "none";
  video.width = 1800;
  video.height = 260;
  illustration.append(video);

  let nearView = false;
  let inView = false;
  let loaded = false;
  let starting = false;
  const shouldPlay = () => inView && !document.hidden && !reduced.matches;
  const update = () => {
    if (nearView && !reduced.matches && !loaded) {
      loaded = true;
      video.poster = "assets/web/stages-loop-poster.webp";
      for (const [extension, type] of [["webm", "video/webm"], ["mp4", "video/mp4"]]) {
        const source = document.createElement("source");
        source.src = `assets/web/stages-loop.${extension}`;
        source.type = type;
        video.append(source);
      }
      video.preload = "auto";
      video.load();
    }
    if (!shouldPlay()) {
      video.pause();
      return;
    }
    if (loaded && video.paused && !starting) {
      starting = true;
      video.play().catch(() => {
        // Keep the original illustration if autoplay or media decoding fails.
      }).finally(() => {
        starting = false;
        if (!shouldPlay()) video.pause();
      });
    }
  };
  video.addEventListener("playing", () => {
    video.classList.add("is-ready");
    video.dataset.playing = "true";
  });
  video.addEventListener("pause", () => { video.dataset.playing = "false"; });
  video.addEventListener("error", () => { video.classList.remove("is-ready"); });
  new IntersectionObserver(([entry]) => {
    nearView = entry.isIntersecting;
    update();
  }, { rootMargin: "300px" }).observe(illustration);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  }, { threshold: 0.05 }).observe(illustration);
  document.addEventListener("visibilitychange", update);
  reduced.addEventListener("change", update);
})();
