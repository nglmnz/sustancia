/* ============================================
   TEMA OSCURO / CLARO
   Lee preferencia del sistema por defecto,
   guarda en localStorage si el usuario cambia
============================================ */
document.addEventListener('DOMContentLoaded', () => {

  const toggleBtn = document.getElementById('theme-toggle');
  const html      = document.documentElement;

  const saved = localStorage.getItem('sustancia-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved ?? (prefersDark ? 'dark' : 'light');

  html.setAttribute('data-theme', initial);
  if (toggleBtn) toggleBtn.textContent = initial === 'dark' ? '☀️' : '🌙';

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('sustancia-theme', next);
      toggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }

  /* ============================================
     VIDEO HERO — FADE SYSTEM
     500ms fade-in al cargar y al hacer loop.
     500ms fade-out cuando quedan 0.55s al final.
  ============================================ */
  const video = document.getElementById('hero-video');
  if (!video) return;

  let rafId       = null;
  let fadingOut   = false;
  const FADE_MS   = 500;
  const FADE_END_BEFORE = 0.55;

  function cancelRaf() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function fadeTo(targetOpacity, duration, onDone) {
    cancelRaf();
    const startOpacity = parseFloat(video.style.opacity) || 0;
    const startTime    = performance.now();
    const delta        = targetOpacity - startOpacity;

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      video.style.opacity = startOpacity + delta * progress;
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
        if (onDone) onDone();
      }
    }
    rafId = requestAnimationFrame(step);
  }

  function fadeIn() {
    fadingOut = false;
    fadeTo(1, FADE_MS);
  }

  function fadeOut(onDone) {
    fadingOut = true;
    fadeTo(0, FADE_MS, onDone);
  }

  video.addEventListener('canplaythrough', () => {
    video.style.opacity = '0';
    fadeIn();
  }, { once: true });

  video.addEventListener('timeupdate', () => {
    if (!video.duration || fadingOut) return;
    if (video.currentTime >= video.duration - FADE_END_BEFORE) {
      fadeOut(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        setTimeout(() => fadeIn(), 80);
      });
    }
  });

  video.play().catch(() => {});
});
