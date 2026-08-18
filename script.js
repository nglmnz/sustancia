// Interruptor de Tema Oscuro/Claro
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Cargar preferencia guardada
  const currentTheme = localStorage.getItem('sustancia-theme');
  if (currentTheme) {
    html.setAttribute('data-theme', currentTheme);
    toggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  } else {
    // Si no hay preferencia, usar sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    toggleBtn.textContent = prefersDark ? '☀️' : '🌙';
  }

  // Evento click
  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('sustancia-theme', next);
    toggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
});
