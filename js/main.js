// ========================================
// JAVASCRIPT - Hamburger Menu + Dinâmico
// ========================================

// ===== NAVBAR - Toggle Hamburger Menu =====

const hamburgerBtn = document.getElementById('hamburgerBtn');
const navbarMenu = document.getElementById('navbarMenu');
const navbarLinks = document.querySelectorAll('.navbar__link');

// Toggle menu on hamburger click
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navbarMenu.classList.toggle('active');
  });
}

// Close menu when clicking on a link
navbarLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburgerBtn.classList.remove('active');
    navbarMenu.classList.remove('active');
  });
});

// Close menu when pressing Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hamburgerBtn.classList.remove('active');
    navbarMenu.classList.remove('active');
  }
});

// ===== FOOTER - Auto Year Update =====

const currentYear = new Date().getFullYear();
const footerYear = document.getElementById('footerYear');
if (footerYear) {
  footerYear.textContent = currentYear;
}
