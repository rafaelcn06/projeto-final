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
    if (loginModal && loginModal.classList.contains('modal--open')) closeLoginModalFunc();
    if (createAdModal && createAdModal.classList.contains('modal--open')) closeCreateAdModalFunc();
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
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const cartButton = document.getElementById('cartButton');
const userBadge = document.getElementById('userBadge');

const users = {
  admin: { passwords: ['admim', 'admin'], role: 'admin', label: 'Admin' },
  cliente: { passwords: ['cliente'], role: 'client', label: 'Cliente' }
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
  const createAdBtnEl = document.getElementById('createAdBtn');
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

    if (createAdBtnEl) {
      if (currentUser.role === 'admin') {
        createAdBtnEl.classList.remove('hide');
      } else {
        createAdBtnEl.classList.add('hide');
      }
    }
  } else {
    loginTrigger.textContent = 'Login';
    loginTrigger.classList.remove('navbar__button--active');
    cartButton.classList.add('hide');
    cartButton.disabled = true;
    userBadge.classList.add('hide');
    if (createAdBtnEl) createAdBtnEl.classList.add('hide');
  }

  updateStaticCardActions();
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

document.querySelectorAll('.modal__backdrop').forEach((backdrop) => {
  backdrop.addEventListener('click', () => {
    const modal = backdrop.closest('.modal');
    if (!modal) return;
    if (modal.id === 'loginModal') closeLoginModalFunc();
    if (modal.id === 'createAdModal') closeCreateAdModalFunc();
  });
});

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
    if (!userData || !userData.passwords.includes(password.toLowerCase())) {
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
    const currentUser = getStoredUser();
    if (!currentUser || currentUser.role !== 'client') {
      alert('Somente clientes podem acessar o carrinho. Faça login como cliente para continuar.');
      return;
    }
    window.location.href = 'checkout.html';
  });
}

updateUserState();

/* ==================================================
   ANÚNCIOS - Criação, Renderização e Carrinho Básico
   ================================================== */

const createAdBtn = document.getElementById('createAdBtn');
const createAdModal = document.getElementById('createAdModal');
const closeCreateAdModal = document.getElementById('closeCreateAdModal');
const createAdForm = document.getElementById('createAdForm');
const createAdError = document.getElementById('createAdError');

function getProducts() {
  try {
    return JSON.parse(localStorage.getItem('arenaProducts')) || [];
  } catch (e) {
    return [];
  }
}

function setProducts(arr) {
  localStorage.setItem('arenaProducts', JSON.stringify(arr));
}

function getInitialProducts() {
  return [
    {
      id: 'camiseta-basica',
      title: 'Camiseta Básica',
      description: '100% algodão, macia e confortável. Disponível em várias cores.',
      category: 'camisetas',
      price: 49.9,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'camiseta-estampada',
      title: 'Camiseta Estampada',
      description: 'Designs exclusivos com estampas de alta qualidade que não desbotam.',
      category: 'camisetas',
      price: 59.9,
      stock: 14,
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'camiseta-polo',
      title: 'Camiseta Polo',
      description: 'Estilo clássico e elegante, perfeita para ocasiões casuais e semi-formais.',
      category: 'camisetas',
      price: 69.9,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'camiseta-premium-gola-v',
      title: 'Camiseta Premium Gola V',
      description: 'Tecido de alta qualidade com acabamento premium. Confortável para o dia a dia.',
      category: 'camisetas',
      price: 79.9,
      stock: 9,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'camiseta-oversized',
      title: 'Camiseta Oversized Confortável',
      description: 'Corte amplo e moderno, perfeita para um look casual e descontraído.',
      category: 'camisetas',
      price: 59.9,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'camiseta-listrada',
      title: 'Camiseta Listrada Clássica',
      description: 'Padrão listrado clássico em cores variadas. Versátil para qualquer estilo.',
      category: 'camisetas',
      price: 44.9,
      stock: 16,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'calca-jeans-classica',
      title: 'Calça Jeans Clássica',
      description: 'Jeans de qualidade premium com corte tradicional. Confortável e durável.',
      category: 'calcas',
      price: 89.9,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'calca-social-slim',
      title: 'Calça Social Slim',
      description: 'Corte slim fit moderno, perfeita para ambientes corporativos.',
      category: 'calcas',
      price: 119.9,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'calca-cargo',
      title: 'Calça Cargo Aventureira',
      description: 'Com múltiplos bolsos funcionais, ideal para quem busca praticidade.',
      category: 'calcas',
      price: 99.9,
      stock: 7,
      image: 'https://images.unsplash.com/photo-1506629905607-0b5b8b5b2b5b?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'legging-confortavel',
      title: 'Legging Confortável',
      description: 'Tecido elástico e respirável, perfeita para atividades físicas.',
      category: 'calcas',
      price: 79.9,
      stock: 13,
      image: 'https://images.unsplash.com/photo-1541578527986-ccbb96293588?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'calca-flare-retro',
      title: 'Calça Flare Retrô',
      description: 'Corte flare moderno resgatando o estilo dos anos 70 com toque atual.',
      category: 'calcas',
      price: 109.9,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1488348057664-e62a68339b17?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'calca-reta-conforto',
      title: 'Calça Reta Conforto',
      description: 'Corte reta clássico que combina com qualquer look. Confortável o dia todo.',
      category: 'calcas',
      price: 74.9,
      stock: 14,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tenis-casual-confortavel',
      title: 'Tênis Casual Confortável',
      description: 'Design confortável e moderno para o dia a dia.',
      category: 'tenis',
      price: 149.9,
      stock: 9,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'sapato-social-elegante',
      title: 'Sapato Social Elegante',
      description: 'Material premium com acabamento impecável para ocasiões formais.',
      category: 'tenis',
      price: 199.9,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tenis-esportivo-premium',
      title: 'Tênis Esportivo Premium',
      description: 'Desenvolvido para máximo desempenho nas atividades físicas.',
      category: 'tenis',
      price: 249.9,
      stock: 7,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'sandalia-confortavel',
      title: 'Sandália Confortável',
      description: 'Perfeita para clima quente com suporte de arco plantar.',
      category: 'tenis',
      price: 89.9,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'botina-classica',
      title: 'Botina Clássica',
      description: 'Estilo clássico e versátil, combina com qualquer look.',
      category: 'tenis',
      price: 179.9,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tenis-vintage-retro',
      title: 'Tênis Vintage Retrô',
      description: 'Design clássico dos anos 80 com tecnologia moderna de conforto.',
      category: 'tenis',
      price: 139.9,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'relogio-esportivo',
      title: 'Relógio Esportivo',
      description: 'Resistente à água e com funções avançadas para atividades físicas.',
      category: 'relogios',
      price: 299.9,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'relogio-classico',
      title: 'Relógio Clássico',
      description: 'Design atemporal e elegante, perfeito para ocasiões formais.',
      category: 'relogios',
      price: 399.9,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'relogio-digital',
      title: 'Relógio Digital',
      description: 'Moderno e funcional com display digital de fácil leitura.',
      category: 'relogios',
      price: 199.9,
      stock: 11,
      image: 'https://images.unsplash.com/photo-1488348057664-e62a68339b17?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'smartwatch-inteligente',
      title: 'Smartwatch Inteligente',
      description: 'Relógio inteligente com notificações e monitoramento de saúde.',
      category: 'relogios',
      price: 599.9,
      stock: 4,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'relogio-vintage',
      title: 'Relógio Vintage',
      description: 'Design retrô com mecanismo clássico de qualidade excepcional.',
      category: 'relogios',
      price: 349.9,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mochila-escolar',
      title: 'Mochila Escolar',
      description: 'Mochila resistente e espaçosa, perfeita para estudantes.',
      category: 'mochilas',
      price: 89.9,
      stock: 13,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mochila-viagem',
      title: 'Mochila de Viagem',
      description: 'Ideal para viagens, com capacidade ampla e design ergonômico.',
      category: 'mochilas',
      price: 129.9,
      stock: 7,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mochila-executiva',
      title: 'Mochila Executiva',
      description: 'Design profissional e elegante para ambientes corporativos.',
      category: 'mochilas',
      price: 149.9,
      stock: 4,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'bolsa-tote-moderna',
      title: 'Bolsa Tote Moderna',
      description: 'Estilo casual e versátil, combinável com qualquer look.',
      category: 'mochilas',
      price: 109.9,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mochila-esportiva',
      title: 'Mochila Esportiva',
      description: 'Perfeita para academia e atividades ao ar livre.',
      category: 'mochilas',
      price: 99.9,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    }
  ];
}

function ensureProductsSeeded() {
  const current = getProducts();
  if (!current.length) {
    setProducts(getInitialProducts());
  }
}

function findProductByTitle(title) {
  if (!title) return null;
  const normalized = title.trim().toLowerCase();
  return getProducts().find((product) => product.title.trim().toLowerCase() === normalized);
}

function updateStaticCardActions() {
  const currentUser = getStoredUser();
  document.querySelectorAll('.card__delete-button').forEach((button) => {
    if (!currentUser || currentUser.role !== 'admin') {
      button.classList.add('hide');
    } else {
      button.classList.remove('hide');
    }
  });
}

function hydrateStaticCards() {
  ensureProductsSeeded();
  const products = getProducts();
  document.querySelectorAll('.cards-grid .card').forEach((card) => {
    if (card.dataset.static === 'true') return;
    const titleEl = card.querySelector('.card__title');
    if (!titleEl) return;
    const product = findProductByTitle(titleEl.textContent);
    if (!product) return;

    card.dataset.productId = product.id;
    card.dataset.static = 'true';
    card.classList.add('product-card');

    const content = card.querySelector('.card__content');
    if (!content) return;

    if (!card.querySelector('.card__description')) {
      const description = document.createElement('p');
      description.className = 'card__description';
      description.textContent = product.description;
      const nextSibling = content.firstChild ? content.firstChild.nextSibling : null;
      content.insertBefore(description, nextSibling);
    }

    if (!card.querySelector('.card__stock')) {
      const stock = document.createElement('div');
      stock.className = 'card__stock';
      stock.textContent = 'Estoque: ' + product.stock;
      content.appendChild(stock);
    }

    if (!card.querySelector('.card__price')) {
      const price = document.createElement('div');
      price.className = 'card__price';
      price.textContent = 'R$ ' + Number(product.price).toFixed(2).replace('.', ',');
      content.appendChild(price);
    }

    if (!card.querySelector('.card__delete-button')) {
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'card__button card__delete-button hide';
      deleteBtn.setAttribute('data-id', product.id);
      deleteBtn.textContent = 'Excluir anúncio';
      content.appendChild(deleteBtn);
    }
  });
  updateStaticCardActions();
}

function deleteProductById(productId) {
  const products = getProducts();
  const filtered = products.filter((product) => product.id !== productId);
  setProducts(filtered);
  document.querySelectorAll('[data-product-id="' + productId + '"]').forEach((element) => {
    const card = element.closest('.card');
    if (card) card.remove();
  });
  renderProductsForCurrentPage();
}

function openCreateAdModal() {
  if (!createAdModal) return;
  createAdModal.classList.add('modal--open');
  createAdModal.setAttribute('aria-hidden', 'false');
}

function closeCreateAdModalFunc() {
  if (!createAdModal) return;
  createAdModal.classList.remove('modal--open');
  createAdModal.setAttribute('aria-hidden', 'true');
  if (createAdError) createAdError.textContent = '';
  if (createAdForm) createAdForm.reset();
}

if (createAdBtn) {
  createAdBtn.addEventListener('click', () => {
    const currentUser = getStoredUser();
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Apenas administradores podem criar anúncios.');
      return;
    }
    openCreateAdModal();
  });
}

if (closeCreateAdModal) closeCreateAdModal.addEventListener('click', closeCreateAdModalFunc);

// handle file to dataURL
function fileToDataURL(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

async function handleCreateAdSubmit(e) {
  e.preventDefault();
  if (!createAdForm || !createAdError) return;

  const title = createAdForm.querySelector('[name="title"]').value.trim();
  const description = createAdForm.querySelector('[name="description"]').value.trim();
  const category = createAdForm.querySelector('[name="category"]').value;
  const price = parseFloat(createAdForm.querySelector('[name="price"]').value);
  const stock = parseInt(createAdForm.querySelector('[name="stock"]').value, 10);
  const imageUrl = createAdForm.querySelector('[name="imageUrl"]').value.trim();
  const imageFile = createAdForm.querySelector('[name="imageFile"]').files[0];

  if (!title || !description || !category || isNaN(price) || isNaN(stock)) {
    createAdError.textContent = 'Preencha todos os campos corretamente.';
    return;
  }

  let imageData = '';
  if (imageFile) {
    const allowed = ['image/jpeg','image/png'];
    if (!allowed.includes(imageFile.type)) {
      createAdError.textContent = 'Somente imagens .jpg ou .png são permitidas.';
      return;
    }
    try {
      imageData = await fileToDataURL(imageFile);
    } catch (err) {
      createAdError.textContent = 'Erro ao ler o arquivo de imagem.';
      return;
    }
  } else if (imageUrl) {
    imageData = imageUrl;
  } else {
    createAdError.textContent = 'Forneça um link de imagem ou anexe um arquivo.';
    return;
  }

  const products = getProducts();
  const id = Date.now().toString(36);
  const product = {
    id,
    title,
    description,
    category, // category is a slug like 'relogios' or 'camisetas'
    price: Number(price.toFixed(2)),
    stock: Number(stock),
    image: imageData,
    createdAt: new Date().toISOString()
  };

  products.push(product);
  setProducts(products);

  // re-render the current page if it has a cards container
  renderProductsForCurrentPage();
  closeCreateAdModalFunc();
}

if (createAdForm) createAdForm.addEventListener('submit', handleCreateAdSubmit);

// Render functions
function slugFromPath() {
  const p = window.location.pathname.split('/').pop() || '';
  return p.replace('.html','').toLowerCase();
}

function renderProductsForCurrentPage() {
  const slug = slugFromPath();
  renderProductsForCategory(slug);
}

function createProductCard(product) {
  const article = document.createElement('article');
  article.className = 'card product-card';
  article.dataset.productId = product.id;
  article.dataset.source = 'dynamic';

  const imgWrap = document.createElement('div');
  imgWrap.className = 'card__image';
  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.title;
  imgWrap.appendChild(img);

  const content = document.createElement('div');
  content.className = 'card__content';
  const h3 = document.createElement('h3');
  h3.className = 'card__title';
  h3.textContent = product.title;
  const p = document.createElement('p');
  p.className = 'card__description';
  p.textContent = product.description;
  const meta = document.createElement('div');
  meta.className = 'card__meta';
  const cat = document.createElement('span');
  cat.className = 'card__category';
  cat.textContent = product.category;
  const level = document.createElement('span');
  level.className = 'card__level';
  level.textContent = 'Novo';
  meta.appendChild(cat);
  meta.appendChild(level);

  const price = document.createElement('div');
  price.className = 'card__price';
  price.textContent = 'R$ ' + product.price.toFixed(2).replace('.',',');

  const stock = document.createElement('div');
  stock.className = 'card__stock';
  stock.textContent = 'Estoque: ' + product.stock;

  const btn = document.createElement('button');
  btn.className = 'card__button add-to-cart';
  btn.setAttribute('data-id', product.id);
  btn.textContent = 'Adicionar ao carrinho';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'card__button card__delete-button hide';
  deleteBtn.setAttribute('data-id', product.id);
  deleteBtn.textContent = 'Excluir anúncio';

  content.appendChild(h3);
  content.appendChild(p);
  content.appendChild(meta);
  content.appendChild(price);
  content.appendChild(stock);
  content.appendChild(btn);
  content.appendChild(deleteBtn);

  article.appendChild(imgWrap);
  article.appendChild(content);
  return article;
}

function renderProductsForCategory(categorySlug) {
  const grid = document.querySelector('.cards-grid');
  if (!grid) return;
  ensureProductsSeeded();

  const existingIds = new Set(
    Array.from(grid.querySelectorAll('[data-product-id]')).map(el => el.getAttribute('data-product-id'))
  );

  grid.querySelectorAll('.product-card[data-source="dynamic"]').forEach(n => n.remove());

  let products = getProducts();
  if (categorySlug === 'departamento') {
    // keep all products on the department page
  } else if (categorySlug === 'ofertas' || categorySlug === 'aula_03') {
    products = products.slice(0, 6);
  } else {
    products = products.filter(p => p.category === categorySlug);
  }

  products.forEach(p => {
    if (existingIds.has(p.id)) return;
    const card = createProductCard(p);
    grid.appendChild(card);
  });
}

// Delegate clicks: product card click -> product detail, add-to-cart, delete
document.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.card__delete-button');
  if (deleteBtn) {
    const id = deleteBtn.getAttribute('data-id');
    const currentUser = getStoredUser();
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Apenas administradores podem excluir anúncios.');
      return;
    }
    deleteProductById(id);
    return;
  }

  const atc = e.target.closest('.add-to-cart');
  if (atc) {
    const id = atc.getAttribute('data-id');
    const currentUser = getStoredUser();
    if (!currentUser || currentUser.role !== 'client') {
      alert('Somente clientes podem adicionar ao carrinho.');
      return;
    }
    addToCart(id);
    // update stock display
    const stockEl = document.querySelector('[data-product-id="' + id + '"] .card__stock');
    const prod = getProducts().find(p => p.id === id);
    if (stockEl && prod) stockEl.textContent = 'Estoque: ' + prod.stock;
    return;
  }

  const card = e.target.closest('.product-card');
  if (card && !e.target.classList.contains('add-to-cart') && !e.target.classList.contains('card__delete-button')) {
    const id = card.getAttribute('data-product-id');
    window.location.href = 'product.html?id=' + encodeURIComponent(id);
  }
});

function getCart() {
  try {
    return JSON.parse(sessionStorage.getItem('arenaCart') || '[]');
  } catch (err) {
    return [];
  }
}

function setCart(cart) {
  sessionStorage.setItem('arenaCart', JSON.stringify(cart));
}

function getCartDetails() {
  const products = getProducts();
  return getCart()
    .map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return null;
      return {
        id: item.id,
        qty: item.qty,
        product,
        subtotal: Number((product.price * item.qty).toFixed(2))
      };
    })
    .filter(Boolean);
}

function getCartTotal() {
  return getCartDetails().reduce((sum, item) => sum + item.subtotal, 0).toFixed(2);
}

function renderCheckoutPage() {
  const cartSummary = document.getElementById('cartSummary');
  const checkoutTotal = document.getElementById('checkoutTotal');
  if (!cartSummary || !checkoutTotal) return;

  const items = getCartDetails();
  if (!items.length) {
    cartSummary.innerHTML = '<p>Seu carrinho está vazio. Adicione produtos para iniciar o pagamento.</p>';
    checkoutTotal.textContent = 'R$ 0,00';
    return;
  }

  cartSummary.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Qtd</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(item => `
            <tr>
              <td>${item.product.title}</td>
              <td>${item.qty}</td>
              <td>R$ ${item.subtotal.toFixed(2).replace('.', ',')}</td>
              <td><button type="button" class="cart-remove" data-id="${item.id}">Remover</button></td>
            </tr>
          `)
          .join('')}
      </tbody>
    </table>
  `;
  checkoutTotal.textContent = `R$ ${getCartTotal().replace('.', ',')}`;
  if (paymentResult) paymentResult.innerHTML = '';
}

function updatePaymentDetails() {
  const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
  document.querySelectorAll('.payment-method-details').forEach(block => {
    block.classList.toggle('active', block.dataset.method === selectedMethod?.value);
  });
}

function setPaymentMessage(html) {
  const paymentResult = document.getElementById('paymentResult');
  if (!paymentResult) return;
  paymentResult.innerHTML = html;
  paymentResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearCart() {
  setCart([]);
  renderCheckoutPage();
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  setCart(cart);
  renderCheckoutPage();
}

function completePayment(method, data) {
  const items = getCartDetails();
  if (!items.length) {
    alert('Carrinho vazio. Adicione produtos antes de finalizar o pagamento.');
    return;
  }

  const total = `R$ ${Number(getCartTotal()).toFixed(2).replace('.', ',')}`;
  const products = getProducts();
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    if (!product || product.stock < item.qty) {
      alert(`Estoque insuficiente para ${item.product.title}.`);
      return;
    }
    product.stock = product.stock - item.qty;
  }
  setProducts(products);
  setCart([]);
  renderCheckoutPage();
  renderProductsForCurrentPage();

  const orderId = Date.now().toString(36).toUpperCase();
  const summary = {
    cartao_credito: 'Compra aprovada com cartão de crédito. O estoque foi atualizado e o pedido será processado.',
    cartao_debito: 'Compra aprovada com cartão de débito. O estoque foi atualizado e o pedido será processado.'
  };

  setPaymentMessage(`
    <div class="payment-result-box">
      <h3>Compra aprovada</h3>
      <p>Pedido <strong>#${orderId}</strong> confirmado.</p>
      <p>Total pago: <strong>${total}</strong></p>
      <p>${summary[method] || 'Compra aprovada com sucesso.'}</p>
    </div>
  `);
  alert('Compra aprovada! Veja a confirmação na página.');
}

function handleCheckoutSubmit(event) {
  event.preventDefault();
  const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
  if (!selectedMethod) {
    alert('Selecione uma forma de pagamento.');
    return;
  }

  const method = selectedMethod.value;
  const activeDetails = document.querySelector(`.payment-method-details[data-method="${method}"]`);
  if (!activeDetails) {
    alert('Ocorreu um erro ao identificar a forma de pagamento.');
    return;
  }

  const holder = activeDetails.querySelector('input[name="name"]')?.value.trim();
  const documentField = activeDetails.querySelector('input[name="document"]')?.value.trim();

  if (!holder) {
    alert('Informe o nome do portador.');
    return;
  }

  if (!documentField) {
    alert('Informe o CPF/CNPJ.');
    return;
  }

  if (method === 'cartao_credito' || method === 'cartao_debito') {
    const cardNumber = activeDetails.querySelector('input[name="cardNumber"]')?.value.replace(/\s/g, '');
    const expiry = activeDetails.querySelector('input[name="expiry"]')?.value.trim();
    const cvv = activeDetails.querySelector('input[name="cvv"]')?.value.trim();

    if (!cardNumber || cardNumber.length < 12) {
      alert('Informe um número de cartão válido.');
      return;
    }
    if (!expiry) {
      alert('Informe a validade do cartão.');
      return;
    }
    if (!cvv || cvv.length < 3) {
      alert('Informe o código de segurança do cartão.');
      return;
    }
  }

  completePayment(method, { holder, document: documentField });
}

function handleCheckoutInteractions() {
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  paymentRadios.forEach(radio => radio.addEventListener('change', updatePaymentDetails));

  document.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('.cart-remove');
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.id);
    }
  });

  const clearCartBtn = document.getElementById('clearCartBtn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }

  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', handleCheckoutSubmit);
    updatePaymentDetails();
  }
}

function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  const currentQty = item ? item.qty : 0;

  if (product.stock <= 0 || currentQty >= product.stock) {
    alert('Não há estoque suficiente para mais unidades deste produto.');
    return;
  }

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  setCart(cart);
  alert('Produto adicionado ao carrinho.');
}

// On load, render according to current page
document.addEventListener('DOMContentLoaded', () => {
  hydrateStaticCards();
  renderProductsForCurrentPage();
  updateUserState();
  renderCheckoutPage();
  handleCheckoutInteractions();
});
