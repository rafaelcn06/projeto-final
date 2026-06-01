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
if (navbarMenu) {
  navbarMenu.addEventListener('click', (e) => {
    const link = e.target.closest('.navbar__link');
    if (!link) return;
    if (link.closest('.navbar__dropdown')) return;
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    navbarMenu.classList.remove('active');
  });
}

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

// ========================================================================


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

  updateNavbarMenu(currentUser);
  updateStaticCardActions();
}

// Esta função atualiza dinamicamente o menu de navegação com base no usuário atualmente logado. 
// Ela remove o link "Home" para todos, garante que os links de "Ofertas" e "Categorias" estejam sempre visíveis, e adiciona um link de "Pedidos" 
// apenas para clientes logados. Para administradores, ela mantém o link de criação de anúncios visível. Essa abordagem permite que o menu se adapte ao 
// contexto do usuário, melhorando a experiência de navegação.
function updateNavbarMenu(currentUser) {
  const menu = document.getElementById('navbarMenu');
  if (!menu) return;

  const homeLinkItem = menu.querySelector('.navbar__link[href="aula_03.html"]')?.closest('li');
  if (homeLinkItem) homeLinkItem.remove();

  const ofertasItem = menu.querySelector('.navbar__link[href="ofertas.html"]')?.closest('li');
  const categoryItem = menu.querySelector('.navbar__dropdown');

  if (ofertasItem && categoryItem) {
    menu.insertBefore(ofertasItem, menu.firstChild);
    menu.insertBefore(categoryItem, ofertasItem.nextSibling);
  }

  const existingOrdersItem = menu.querySelector('.navbar__item--orders');
  if (currentUser && currentUser.role === 'client') {
    if (!existingOrdersItem) {
      const ordersItem = document.createElement('li');
      ordersItem.className = 'navbar__item navbar__item--orders';
      ordersItem.innerHTML = '<a href="orders.html" class="navbar__link">Pedidos</a>';
      if (categoryItem) {
        menu.insertBefore(ordersItem, categoryItem.nextSibling);
      } else {
        menu.appendChild(ordersItem);
      }
    }
  } else if (existingOrdersItem) {
    existingOrdersItem.remove();
  }
}


// ======== Funções para abrir e fechar o modal de login ====================
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

    setStoredUser({ username, role: userData.role, label: userData.label });
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

// =======================================================================

/* ==================================================
   ANÚNCIOS - Criação, Renderização e Carrinho Básico
   ================================================== */

const createAdBtn = document.getElementById('createAdBtn');
const createAdModal = document.getElementById('createAdModal');
const closeCreateAdModal = document.getElementById('closeCreateAdModal');
const createAdForm = document.getElementById('createAdForm');
const createAdError = document.getElementById('createAdError');

// Funções para manipular os produtos armazenados no localStorage
function getProducts() {
  try {
    return JSON.parse(localStorage.getItem('arenaProducts')) || [];
  } catch (e) {
    return [];
  }
}
// Esta função salva o array de produtos atualizado no localStorage, garantindo que as alterações persistam mesmo após recarregar a página.
function setProducts(arr) {
  localStorage.setItem('arenaProducts', JSON.stringify(arr));
}
// Esta função retorna um array de produtos pré-definidos, cada um com propriedades como id, título, descrição, categoria, preço, estoque, imagem e data de criação. Esses produtos servem como dados iniciais para as cards estáticas na página e para garantir que haja conteúdo para exibir mesmo antes de o usuário criar anúncios personalizados.
function getInitialProducts() {
  return [
    // ================== CAMISETAS ==================
    {
      id: 'camiseta-dryfit-pro',
      title: 'Camiseta Dry Fit Pro',
      description: 'Tecnologia de evaporação rápida de suor. Ideal para treinos intensos e corrida.',
      category: 'camisetas',
      price: 69.90,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'camiseta-algodao-egipcio',
      title: 'Camiseta Algodão Egípcio',
      description: 'Toque extremamente macio e caimento perfeito. O básico premium para o dia a dia.',
      category: 'camisetas',
      price: 119.90,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'camiseta-longline-street',
      title: 'Camiseta Longline Street',
      description: 'Corte alongado com barra abaulada. Estilo urbano e despojado para qualquer rolê.',
      category: 'camisetas',
      price: 89.90,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'camiseta-henley-casual',
      title: 'Camiseta Henley Casual',
      description: 'Gola portuguesa com botões. Uma alternativa rústica e elegante à tradicional gola careca.',
      category: 'camisetas',
      price: 95.00,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },

    // ================== CALÇAS ==================
    {
      id: 'calca-jogger-sarja',
      title: 'Calça Jogger de Sarja',
      description: 'Conforto do moletom com o visual estruturado da sarja. Punhos elásticos nos tornozelos.',
      category: 'calcas',
      price: 149.90,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1624378439575-d170c6d44a11?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'calca-jeans-destroyed',
      title: 'Calça Jeans Destroyed',
      description: 'Lavagem estonada com rasgos rasgados a laser. Corte slim moderno.',
      category: 'calcas',
      price: 179.90,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'calca-moletom-sport',
      title: 'Calça Moletom Sport',
      description: 'Interior flanelado super quente. Possui bolsos com zíper para maior segurança.',
      category: 'calcas',
      price: 129.90,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'calca-pantalona-linho',
      title: 'Calça Pantalona em Linho',
      description: 'Modelagem ampla e tecido respirável. Traz elegância imediata para climas quentes.',
      category: 'calcas',
      price: 199.90,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },

    // ================== TÊNIS ==================
    {
      id: 'tenis-running-aero',
      title: 'Tênis Running Aero Pro',
      description: 'Amortecimento responsivo de ponta a ponta. Extremamente leve e aerodinâmico.',
      category: 'tenis',
      price: 349.90,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tenis-slip-on-urban',
      title: 'Tênis Slip On Urban',
      description: 'Sem cadarços para praticidade máxima. Solado vulcanizado clássico.',
      category: 'tenis',
      price: 189.90,
      stock: 22,
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tenis-basket-high',
      title: 'Tênis Basket High Top',
      description: 'Cano alto com suporte reforçado de tornozelo. Visual retro das quadras dos anos 90.',
      category: 'tenis',
      price: 429.90,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tenis-casual-white',
      title: 'Tênis Casual White Core',
      description: 'O clássico tênis branco de couro sintético. Combina desde a alfaiataria até o jeans.',
      category: 'tenis',
      price: 219.90,
      stock: 14,
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },

    // ================== RELÓGIOS ==================
    {
      id: 'relogio-cronografo-aco',
      title: 'Relógio Cronógrafo em Aço',
      description: 'Mecanismo suíço, vidro de safira e mostrador funcional completo.',
      category: 'relogios',
      price: 659.00,
      stock: 7,
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'relogio-minimal-couro',
      title: 'Relógio Minimalista Couro',
      description: 'Mostrador limpo sem números e pulseira de couro genuíno. Elegância discreta.',
      category: 'relogios',
      price: 289.90,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'relogio-smart-fitness',
      title: 'Smartwatch Fitness Ultra',
      description: 'Monitoramento cardíaco, GPS embutido e bateria para 14 dias.',
      category: 'relogios',
      price: 899.00,
      stock: 4,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'relogio-diver-ocean',
      title: 'Relógio Diver Ocean Pro',
      description: 'Resistência à água de 300m e catraca rotativa bidirecional. Feito para exploração.',
      category: 'relogios',
      price: 749.50,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },

    // ================== MOCHILAS ==================
    {
      id: 'mochila-fotografica-tech',
      title: 'Mochila Fotográfica Tech',
      description: 'Divisórias acolchoadas ajustáveis e acesso rápido lateral para câmeras e lentes.',
      category: 'mochilas',
      price: 329.90,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mochila-couro-vintage',
      title: 'Mochila Couro Vintage',
      description: 'Couro tratado com aspecto envelhecido. Ferragens em latão rústico.',
      category: 'mochilas',
      price: 459.00,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mochila-trekking-50l',
      title: 'Mochila Trekking 50L',
      description: 'Estrutura ergonômica de alumínio e capa de chuva integrada. Ideal para trilhas longas.',
      category: 'mochilas',
      price: 389.90,
      stock: 11,
      image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mochila-notebook-impermeavel',
      title: 'Mochila Notebook Anti-Furto',
      description: 'Zíperes embutidos ocultos, material impermeável e porta USB externa.',
      category: 'mochilas',
      price: 249.90,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1554342872-034a06541bad?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString()
    }
  ];
}

// Esta função verifica se já existem produtos armazenados no localStorage. Se não houver, ela carrega um conjunto inicial de produtos pré-definidos. 
// Isso garante que as cards estáticas na página tenham dados para exibir, mesmo que o usuário nunca tenha criado um anúncio ou se os dados tiverem sido limpos.
function ensureProductsSeeded() {
  const current = getProducts();
  if (!current.length) {
    setProducts(getInitialProducts());
  }
}

// Esta função encontra um produto pelo título, normalizando o texto para comparação.
function findProductByTitle(title) {
  if (!title) return null;
  const normalized = title.trim().toLowerCase();
  return getProducts().find((product) => product.title.trim().toLowerCase() === normalized);
}

// Esta função percorre todas as cards estáticas na página e atualiza a visibilidade dos botões de exclusão com base no papel do usuário atualmente logado.
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

// Esta função percorre todas as cards estáticas na página, identifica qual produto elas representam com base no título, e então adiciona as informações de descrição, estoque, preço e o botão de exclusão (visível apenas para admins).
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

// Esta função remove um produto do localStorage com base no ID fornecido, e também remove a card correspondente da página. 
// Após a exclusão, ela re-renderiza os produtos para garantir que a interface esteja atualizada.
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

// Esta função é responsável por abrir o modal de criação de anúncio, mas antes disso, ela verifica se o usuário atual tem permissão para criar anúncios
//  (ou seja, se é um administrador). Se o usuário não for um administrador, ele recebe um alerta informando que apenas administradores podem criar anúncios.
function openCreateAdModal() {
  if (!createAdModal) return;
  createAdModal.classList.add('modal--open');
  createAdModal.setAttribute('aria-hidden', 'false');
}


// Esta função fecha o modal de criação de anúncio e limpa quaisquer mensagens de erro ou dados do formulário. 
// Ela é chamada tanto quando o usuário clica no botão de fechar quanto após um anúncio ser criado com sucesso.
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

// Função utilitária para converter um arquivo de imagem em Data URL (base64)
function fileToDataURL(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// Esta função lida com o envio do formulário de criação de anúncio. Ela valida os dados inseridos, processa a imagem (se fornecida), 
// cria um novo objeto de produto e o salva no localStorage.
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

// Extrai o slug da URL para determinar qual categoria ou página está sendo visualizada
function slugFromPath() {
  const p = window.location.pathname.split('/').pop() || '';
  const slug = p.replace('.html', '').toLowerCase();
  
  if (slug === '' || slug === 'index') {
    return 'aula_03';
  }
  
  return slug;
}

// Esta função é chamada para renderizar os produtos na página atual, com base no slug extraído da URL. 
// Ela determina qual categoria ou página está sendo visualizada e chama a função de renderização apropriada.
function renderProductsForCurrentPage() {
  const slug = slugFromPath();
  renderProductsForCategory(slug);
}

// Esta função cria um elemento de card para um produto específico, preenchendo-o com as informações do produto e configurando os botões de ação 
// (adicionar ao carrinho e excluir).
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

// Esta função renderiza os produtos na página com base na categoria ou slug fornecido. Ela primeiro garante que os produtos estejam carregados, 
// depois remove quaisquer cards dinâmicos existentes para evitar duplicação. 
// Em seguida, ela filtra os produtos de acordo com a categoria ou slug e cria novos cards para cada produto que deve ser exibido. 
// A função também verifica se um produto já está sendo exibido para evitar adicionar duplicatas.
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

// Carrinho e Checkout
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

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem('arenaOrders') || '[]');
  } catch (err) {
    return [];
  }
}

function setOrders(orders) {
  localStorage.setItem('arenaOrders', JSON.stringify(orders));
}

function addOrder(order) {
  const orders = getOrders();
  orders.push(order);
  setOrders(orders);
}

function getOrdersForUser(username) {
  if (!username) return [];
  return getOrders().filter(order => order.user === username);
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
  const paymentResult = document.getElementById('paymentResult');
  if (!cartSummary || !checkoutTotal) return;

  const items = getCartDetails();
  if (!items.length) {
    cartSummary.innerHTML = '<p>Seu carrinho está vazio. Adicione produtos para iniciar o pagamento.</p>';
    checkoutTotal.textContent = 'R$ 0,00';
    if (paymentResult) paymentResult.innerHTML = '';
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

// Esta função é chamada quando o usuário seleciona um método de pagamento. 
// Ela atualiza a interface para mostrar os campos relevantes para o método escolhido e habilita ou desabilita os inputs de acordo.
function updatePaymentDetails() {
  // 1. Descobre qual método está selecionado usando os values reais do HTML
  const checkedRadio = document.querySelector('input[name="paymentMethod"]:checked');
  if (!checkedRadio) return;
  const selectedMethod = checkedRadio.value; // Será 'cartao_credito' ou 'cartao_debito'

  // 2. Captura os blocos usando o data-method que você colocou no HTML
  const secaoCredito = document.querySelector('fieldset[data-method="cartao_credito"]');
  const secaoDebito = document.querySelector('fieldset[data-method="cartao_debito"]');

  if (!secaoCredito || !secaoDebito) return;

  // 3. Captura os inputs de cada bloco
  const inputsCredito = secaoCredito.querySelectorAll('input, select');
  const inputsDebito = secaoDebito.querySelectorAll('input, select');

  if (selectedMethod === 'cartao_credito') {
    secaoCredito.classList.add('active');
    secaoDebito.classList.remove('active');

    // Habilita crédito e desabilita débito
    inputsCredito.forEach(input => input.disabled = false);
    inputsDebito.forEach(input => input.disabled = true);

  } else if (selectedMethod === 'cartao_debito') {
    secaoDebito.classList.add('active');
    secaoCredito.classList.remove('active');

    // Desabilita crédito e habilita débito
    inputsCredito.forEach(input => input.disabled = true);
    inputsDebito.forEach(input => input.disabled = false);
  }
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
  const currentUser = getStoredUser();
  const orderId = Date.now().toString(36).toUpperCase();
  const orderData = {
    id: orderId,
    user: currentUser?.username || 'cliente',
    items: items.map(item => ({
      id: item.id,
      title: item.product.title,
      qty: item.qty,
      price: item.product.price,
      subtotal: item.subtotal
    })),
    total: Number(getCartTotal()),
    method,
    status: 'pedido a caminho',
    createdAt: new Date().toISOString()
  };
  addOrder(orderData);

  setProducts(products);
  setCart([]);
  renderCheckoutPage();
  renderProductsForCurrentPage();

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

  const currentUser = getStoredUser();
  if (!currentUser) {
    alert('Você precisa estar logado como cliente para finalizar uma compra.');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('arenaCart') || '[]');
  if (cart.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  const products = JSON.parse(localStorage.getItem('arenaProducts') || '[]');

  // ==========================================
  // VALIDAÇÃO E ATUALIZAÇÃO DE ESTOQUE
  // ==========================================
  let estoqueDisponivel = true;
  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (!prod || prod.stock < item.qty) {
      estoqueDisponivel = false;
      alert(`Estoque insuficiente para o produto: ${prod ? prod.title : 'Desconhecido'}`);
    }
  });

  if (!estoqueDisponivel) return;

  // Deduz o estoque
  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod) prod.stock -= item.qty;
  });
  localStorage.setItem('arenaProducts', JSON.stringify(products));

  // ==========================================
  // GERAÇÃO DO PEDIDO
  // ==========================================
  let orderTotal = 0;
  const orderItems = cart.map(item => {
    const prod = products.find(p => p.id === item.id);
    const price = prod ? Number(prod.price) : 0;
    const subtotal = price * item.qty;
    orderTotal += subtotal;

    return {
      id: item.id,
      title: prod ? prod.title : 'Produto Arena',
      qty: item.qty,
      price: price,
      subtotal: subtotal
    };
  });

  // Lê exatamente o valor selecionado no HTML ('cartao_credito' ou 'cartao_debito')
  const selectedMethodRadio = document.querySelector('input[name="paymentMethod"]:checked');
  const orderMethod = selectedMethodRadio ? selectedMethodRadio.value : 'cartao_credito';

  const newOrder = {
    id: 'PED-' + Math.floor(100000 + Math.random() * 900000),
    username: currentUser.username,
    createdAt: new Date().toISOString(),
    status: 'Aprovado',
    total: orderTotal,
    method: orderMethod,
    items: orderItems
  };

  const totalOrders = JSON.parse(localStorage.getItem('arenaOrders') || '[]');
  totalOrders.push(newOrder);
  localStorage.setItem('arenaOrders', JSON.stringify(totalOrders));

  // ==========================================
  // MENSAGEM E REDIRECIONAMENTO
  // ==========================================
  if (typeof clearCart === 'function') {
    clearCart();
  } else {
    localStorage.removeItem('arenaCart');
  }

  const paymentResult = document.getElementById('paymentResult');
  if (paymentResult) {
    paymentResult.innerHTML = `
      <div style="background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; padding: var(--space-sm); border-radius: var(--radius-md); margin-top: var(--space-md); text-align: center; font-weight: var(--fw-bold);">
        🎉 Pagamento Confirmado! Seu pedido foi gerado e o estoque atualizado.
      </div>
    `;
  }

  // Redireciona para o histórico de pedidos
  setTimeout(() => {
    window.location.href = 'orders.html';
  }, 2500);
}

function handleCheckoutInteractions() {
  // 1. Escuta a troca dos botões de rádio (Crédito / Débito) e arruma a tela
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  if (paymentRadios.length > 0) {
    paymentRadios.forEach(radio => radio.addEventListener('change', updatePaymentDetails));
    // Chama uma vez para desabilitar o campo oculto assim que a página abre
    updatePaymentDetails();
  }

  // 2. Escuta os cliques para remover itens individuais do carrinho
  document.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('.cart-remove');
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.id);
    }
  });

  // 3. Escuta o botão de esvaziar o carrinho inteiro
  const clearCartBtn = document.getElementById('clearCartBtn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }

  // 4. Escuta o botão final de "Confirmar pagamento"
  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', handleCheckoutSubmit);
  }
}

function renderOrdersPage() {
  const ordersContainer = document.getElementById('ordersList');
  if (!ordersContainer) return;

  const currentUser = getStoredUser();
  if (!currentUser || currentUser.role !== 'client') {
    ordersContainer.innerHTML = '<p>Faça login como cliente para ver seus pedidos.</p>';
    return;
  }

  const orders = getOrdersForUser(currentUser.username);
  if (!orders.length) {
    ordersContainer.innerHTML = '<p>Você ainda não tem pedidos.</p>';
    return;
  }

  ordersContainer.innerHTML = `
    <table class="orders-table">
      <thead>
        <tr>
          <th>Pedido</th>
          <th>Data</th>
          <th>Status</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map(order => `
          <tr>
            <td>${order.id}</td>
            <td>${new Date(order.createdAt).toLocaleString('pt-BR')}</td>
            <td>${order.status}</td>
            <td>R$ ${order.total.toFixed(2).replace('.', ',')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ${orders.map(order => `
      <section class="order-detail">
        <h3>Detalhes do pedido ${order.id}</h3>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Método:</strong> ${order.method === 'cartao_credito' ? 'Cartão de crédito' : 'Cartão de débito'}</p>
        <table class="order-items-table">
          <thead>
            <tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.title}</td>
                <td>${item.qty}</td>
                <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                <td>R$ ${item.subtotal.toFixed(2).replace('.', ',')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    `).join('')}
  `;
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

// ==========================================================================
// 1. INICIALIZAÇÃO DA PÁGINA (On Load)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  hydrateStaticCards();
  renderProductsForCurrentPage();
  updateUserState();
  renderCheckoutPage();
  renderOrdersPage();
  updatePaymentDetails(); // Garante que a tela de pagamento carregue certa
});


// ==========================================================================
// 2. DELEGAÇÃO DE EVENTOS GLOBAL (Ouvintes Permanentes)
// ==========================================================================
document.addEventListener('change', function(event) {
  // Se o elemento que mudou for o Radio de Pagamento, atualiza a tela
  if (event.target && event.target.name === 'paymentMethod') {
    updatePaymentDetails();
  }
});

document.addEventListener('submit', function(event) {
  // Se o formulário enviado for o do Checkout, intercepta e salva o pedido
  if (event.target && event.target.id === 'paymentForm') {
    event.preventDefault(); // Trava o recarregamento na raiz imediatamente
    handleCheckoutSubmit(event);
  }
});


// ==========================================================================
// 3. FUNÇÃO DE INTERFACE (Evidente / Oculto)
// ==========================================================================
function updatePaymentDetails() {
  const form = document.getElementById('paymentForm');
  if (!form) return;

  const checkedRadio = form.querySelector('input[name="paymentMethod"]:checked');
  const selectedMethod = checkedRadio ? checkedRadio.value : 'cartao_credito';

  const secaoCredito = form.querySelector('fieldset[data-method="cartao_credito"]');
  const secaoDebito = form.querySelector('fieldset[data-method="cartao_debito"]');

  if (secaoCredito && secaoDebito) {
    const inputsCredito = secaoCredito.querySelectorAll('input, select');
    const inputsDebito = secaoDebito.querySelectorAll('input, select');

    if (selectedMethod === 'cartao_credito') {
      secaoCredito.classList.add('active');
      secaoDebito.classList.remove('active');
      inputsCredito.forEach(i => i.disabled = false);
      inputsDebito.forEach(i => i.disabled = true);
    } else {
      secaoDebito.classList.add('active');
      secaoCredito.classList.remove('active');
      inputsCredito.forEach(i => i.disabled = true);
      inputsDebito.forEach(i => i.disabled = false);
    }
  }
}


// ==========================================================================
// 4. FUNÇÃO DE REGRA DE NEGÓCIO (Persistência de Pedido e Estoque)
// ==========================================================================
function handleCheckoutSubmit(event) {
  if (event) event.preventDefault(); 

  const currentUser = typeof getStoredUser === 'function' ? getStoredUser() : null;
  if (!currentUser) {
    alert('Você precisa estar logado como cliente para finalizar uma compra.');
    return;
  }

  const cart = typeof getCart === 'function' ? getCart() : [];
  if (cart.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  const products = JSON.parse(localStorage.getItem('arenaProducts') || '[]');

  // Validação de Estoque
  let estoqueDisponivel = true;
  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (!prod || prod.stock < item.qty) {
      estoqueDisponivel = false;
      alert(`Estoque insuficiente para o produto: ${prod ? prod.title : 'Desconhecido'}`);
    }
  });

  if (!estoqueDisponivel) return;

  // Deduz o estoque
  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod) prod.stock -= item.qty;
  });
  localStorage.setItem('arenaProducts', JSON.stringify(products));

  // Geração do Pedido
  let orderTotal = 0;
  const orderItems = cart.map(item => {
    const prod = products.find(p => p.id === item.id);
    const price = prod ? Number(prod.price) : 0;
    const subtotal = price * item.qty;
    orderTotal += subtotal;

    return {
      id: item.id,
      title: prod ? prod.title : 'Produto Arena',
      qty: item.qty,
      price: price,
      subtotal: subtotal
    };
  });

  const selectedMethodRadio = document.querySelector('input[name="paymentMethod"]:checked');
  const orderMethod = selectedMethodRadio ? selectedMethodRadio.value : 'cartao_credito';

  // CORREÇÃO: Propriedade ajustada para 'user' e status para 'Em preparação 📦'
  const newOrder = {
    id: 'PED-' + Math.floor(100000 + Math.random() * 900000),
    user: currentUser.username || currentUser.label, 
    createdAt: new Date().toISOString(),
    status: 'Em preparação 📦',
    total: orderTotal,
    method: orderMethod,
    items: orderItems
  };

  const totalOrders = JSON.parse(localStorage.getItem('arenaOrders') || '[]');
  totalOrders.push(newOrder);
  localStorage.setItem('arenaOrders', JSON.stringify(totalOrders));

  // Limpeza e Redirecionamento
  if (typeof clearCart === 'function') {
    clearCart(); // Limpa a sessão
  }

  const paymentResult = document.getElementById('paymentResult');
  if (paymentResult) {
    paymentResult.innerHTML = `
      <div style="background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; padding: var(--space-sm); border-radius: var(--radius-md); margin-top: var(--space-md); text-align: center; font-weight: var(--fw-bold);">
        🎉 Pagamento Confirmado! Seu pedido foi gerado e o estoque atualizado. Redirecionando...
      </div>
    `;
  }

  setTimeout(() => {
    window.location.href = 'orders.html';
  }, 2500);
}