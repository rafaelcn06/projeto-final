# 🛍️ Arena Fashion - Loja de Roupas

## Projeto Completo - Exercício Aula 09 (Engenharia de Interface)

### ✅ Status: CONCLUÍDO

---

## 📁 Estrutura de Arquivos

```
projeto-final/
├── aula_03.html          (Homepage - 4 produtos destacados)
├── camisetas.html        (Categoria: Camisetas - 4 produtos)
├── calcas.html           (Categoria: Calças - 4 produtos)
├── tenis.html            (Categoria: Calçados - 4 produtos)
├── departamento.html     (Hub de Categorias - 4 cards)
├── mochilas.html         (Acessórios: Mochilas - 4 produtos)
├── relogios.html         (Acessórios: Relógios - 4 produtos)
├── js/
│   └── main.js           (Hamburger toggle + Dynamic year)
└── css/
    ├── variables.css     (80+ custom properties)
    ├── reset.css         (Minimal resets)
    ├── base.css          (Semantic HTML)
    ├── layout.css        (Responsive grids)
    ├── utilities.css     (Helper classes)
    └── components/
        ├── navbar.css    (Sticky responsive nav)
        ├── card.css      (Product card component)
        └── footer.css    (Responsive footer)
```

---

## 🎨 Arquitetura CSS: ITCSS + BEM

### Layers (Inverted Triangle CSS)
1. **Settings** - Custom properties (variables.css)
2. **Tools** - Reset rules (reset.css)
3. **Generic** - Base element styling (base.css)
4. **Objects** - Layout patterns (layout.css)
5. **Components** - Reusable UI (navbar, card, footer)
6. **Utilities** - Helper classes

### Naming Convention: BEM
- **Block**: `.navbar`, `.card`, `.footer`
- **Element**: `.navbar__logo`, `.card__image`, `.footer__link`
- **Modifier**: `.card--featured`, `.navbar__menu.active`

---

## 📱 Responsividade

### Breakpoints
- **Mobile** (padrão): 1 coluna
- **Tablet** (768px+): 2 colunas
- **Desktop** (1200px+): 3 colunas

### Features
- Hamburger menu (mobile)
- Sticky navbar
- Responsive grid cards
- 4-column footer (1 col mobile → 4 col desktop)

---

## 🔗 Navegação Completa

### Navbar (5 itens)
1. **Início** → aula_03.html
2. **Todas as Categorias** → departamento.html
3. **Camisetas** → camisetas.html
4. **Calças** → calcas.html
5. **Calçados** → tenis.html

### Links de Produto (Todos funcionam)
- Homepage: 4 cards com links para categorias
- Categorias: Links bidirecionais
- Footer: Links para todas as páginas + homepage

---

## 📊 Conteúdo

### Páginas e Produtos

#### aula_03.html (Homepage)
- Camiseta Básica Premium (R$ 49,90) → camisetas.html
- Calça Jeans Clássica (R$ 89,90) → calcas.html
- Tênis Casual Confortável (R$ 149,90) → tenis.html
- Camiseta Estampada Exclusiva (R$ 59,90) → camisetas.html

#### camisetas.html
1. Camiseta Básica (R$ 49,90)
2. Camiseta Estampada (R$ 59,90)
3. Camiseta Polo (R$ 69,90)
4. Camiseta Premium Gola V (R$ 79,90)

#### calcas.html
1. Calça Jeans Clássica (R$ 89,90)
2. Calça Social Slim (R$ 119,90)
3. Calça Cargo Aventureira (R$ 99,90)
4. Legging Confortável (R$ 79,90)

#### tenis.html
1. Tênis Casual Confortável (R$ 149,90)
2. Sapato Social Elegante (R$ 199,90)
3. Tênis Esportivo Premium (R$ 249,90)
4. Sandália Confortável (R$ 89,90)

#### departamento.html (Hub de Categorias)
- Camisetas Premium (**featured**) → camisetas.html
- Calças Diversificadas → calcas.html
- Calçados Elegantes → tenis.html
- Acessórios da Moda → aula_03.html

#### mochilas.html (Acessórios)
1. Mochila Escolar (R$ 89,90)
2. Mochila de Viagem (R$ 129,90)
3. Mochila Executiva (R$ 149,90)
4. Bolsa Tote Moderna (R$ 109,90)

#### relogios.html (Acessórios)
1. Relógio Esportivo (R$ 299,90)
2. Relógio Clássico (R$ 399,90)
3. Relógio Digital (R$ 199,90)
4. Smartwatch Inteligente (R$ 599,90)

---

## 🎯 Features Implementadas

### ✅ HTML
- Semântica HTML5
- Estrutura BEM
- Data attributes para interatividade

### ✅ CSS
- 80+ custom properties
- Mobile-first responsive
- Transições suaves
- Sombras e efeitos hover
- Grid responsivo

### ✅ JavaScript
- Toggle hamburger menu
- Remove menu ao clicar em item (mobile)
- Close menu com Escape
- Ano dinâmico no footer

### ✅ Tipografia
- Google Fonts (Inter + Poppins)
- Escalas responsivas
- Line-heights otimizadas

### ✅ Componentes
- **Navbar**: Sticky, responsive, com hamburger
- **Cards**: Hover effects, featured state
- **Footer**: Multi-column, responsive, links funcionais

---

## 🚀 Como Usar

### Abrir Localmente
```bash
# Abrir em navegador (file:// protocol)
# Clique duplo em aula_03.html
```

### Ou com Live Server (VS Code)
1. Instale extensão "Live Server"
2. Click direito em aula_03.html
3. Selecione "Open with Live Server"

---

## 📝 Notas Técnicas

### Validação
- ✅ HTML semântico
- ✅ CSS sem conflitos
- ✅ Todos os links funcionando
- ✅ Responsivo em todos os breakpoints

### Performance
- Google Fonts otimizadas
- Imagens Unsplash (otimizadas)
- CSS minificado possível
- JavaScript leve e eficiente

### Acessibilidade
- Semântica HTML
- ARIA labels em hamburger
- Contraste de cores adequado
- Navegação com teclado

---

## 🎓 Requisitos Atendidos

✅ Navbar responsiva com hamburger
✅ Grid responsivo de produtos
✅ Links entre todas as páginas
✅ Footer com informações
✅ Tema: Loja de Roupas (Arena Fashion)
✅ 4 categorias principais (+ 2 auxiliares)
✅ ITCSS + BEM architecture
✅ Mobile-first design
✅ Google Fonts
✅ Interatividade JS

---

## 👨‍💻 Autor
Exercício acadêmico - Aula 09 (Engenharia de Interface)

---

**Última atualização**: 13/05/2026
