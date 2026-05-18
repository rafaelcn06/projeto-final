// ========================================
// JAVASCRIPT - Hamburger Menu + Dinâmico
// ========================================

// ===== NAVBAR - Toggle Hamburger Menu =====

const hamburgerBtn = document.getElementById('hamburgerBtn');
const navbarMenu = document.getElementById('navbarMenu');
const navbarLinks = document.querySelectorAll('.navbar__link');

// Alterna o menu principal no clique do hambúrguer
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navbarMenu.classList.toggle('active');
  });
}

// Fecha o menu hambúrguer ao clicar em um link comum (Ignora o menu de Categorias)
navbarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // Se o link clicado estiver dentro do dropdown de categorias, não fecha o menu principal ainda
    if (link.parentElement.classList.contains('navbar__dropdown')) {
      return;
    }
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    if (navbarMenu) navbarMenu.classList.remove('active');
  });
});

// ===== LOGICA EXCLUSIVA DO DROPDOWN DE CATEGORIAS AO CLICAR =====
const dropdownItem = document.querySelector('.navbar__dropdown');
if (dropdownItem) {
  const dropdownLink = dropdownItem.querySelector('.navbar__link');
  
  if (dropdownLink) {
    dropdownLink.addEventListener('click', (e) => {
      e.preventDefault();   // Evita que a página role para o topo ou mude de endereço
      e.stopPropagation();  // Evita que outros eventos interfiram no clique
      dropdownItem.classList.toggle('active'); // Abre ou recolhe as categorias
    });
  }
}

// Fecha as categorias automaticamente se o usuário clicar em qualquer outro lugar fora do menu
document.addEventListener('click', (e) => {
  if (dropdownItem && !dropdownItem.contains(e.target)) {
    dropdownItem.classList.remove('active');
  }
});

// Fecha tudo se o usuário apertar a tecla ESC do teclado
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    if (navbarMenu) navbarMenu.classList.remove('active');
    if (dropdownItem) dropdownItem.classList.remove('active');
  }
});

// =========================================================================

// ===== FOOTER - Auto Year Update =====

const currentYear = new Date().getFullYear();
const footerYear = document.getElementById('footerYear');
if (footerYear) {
  footerYear.textContent = currentYear;
}

// ===== LOGIN - Usuário e Carrinho =====
const loginTrigger = document.getElementById('loginTrigger');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const cartButton = document.getElementById('cartButton');
const userBadge = document.getElementById('userBadge');

const users = {
  admin: { password: 'admim', role: 'admin', label: 'Admin' },
  cliente: { password: 'cliente', role: 'client', label: 'Cliente' }
};

function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem('arenaUser')) || null;
  } catch (error) {
    return null;
  }
}

function setStoredUser(user) {
  if (user) {
    sessionStorage.setItem('arenaUser', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('arenaUser');
  }
}

function updateUserState() {
  const currentUser = getStoredUser();
  if (!loginTrigger || !cartButton || !userBadge) return;

  if (currentUser) {
    loginTrigger.textContent = 'Sair';
    loginTrigger.classList.add('navbar__button--active');
    userBadge.textContent = currentUser.label;
    userBadge.classList.remove('hide');

    if (currentUser.role === 'client') {
      cartButton.classList.remove('hide');
      cartButton.disabled = false;
    } else {
      cartButton.classList.add('hide');
      cartButton.disabled = true;
    }
  } else {
    loginTrigger.textContent = 'Login';
    loginTrigger.classList.remove('navbar__button--active');
    cartButton.classList.add('hide');
    cartButton.disabled = true;
    userBadge.classList.add('hide');
  }
}

function openLoginModal() {
  if (!loginModal) return;
  loginModal.classList.add('modal--open');
  loginModal.setAttribute('aria-hidden', 'false');
}

function closeLoginModalFunc() {
  if (!loginModal) return;
  loginModal.classList.remove('modal--open');
  loginModal.setAttribute('aria-hidden', 'true');
  if (loginError) loginError.textContent = '';
  if (loginForm) loginForm.reset();
}

if (loginTrigger) {
  loginTrigger.addEventListener('click', () => {
    const currentUser = getStoredUser();
    if (currentUser) {
      setStoredUser(null);
      updateUserState();
      return;
    }
    openLoginModal();
  });
}

if (closeLoginModal) {
  closeLoginModal.addEventListener('click', closeLoginModalFunc);
}

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeLoginModalFunc);
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!loginError) return;

    const userField = document.getElementById('loginUser');
    const passwordField = document.getElementById('loginPassword');
    const username = userField ? userField.value.trim().toLowerCase() : '';
    const password = passwordField ? passwordField.value.trim() : '';

    if (!username || !password) {
      loginError.textContent = 'Preencha usuário e senha.';
      return;
    }

    const userData = users[username];
    if (!userData || userData.password !== password) {
      loginError.textContent = 'Usuário ou senha incorretos.';
      return;
    }

    setStoredUser(userData);
    updateUserState();
    closeLoginModalFunc();
  });
}

if (cartButton) {
  cartButton.addEventListener('click', () => {
    alert('Carrinho ainda não está implementado. Em breve você poderá ver seus itens aqui.');
  });
}

updateUserState();
