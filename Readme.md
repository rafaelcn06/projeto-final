# 🏟️ Arena Multimarcas

Uma plataforma de e-commerce completa, ágil e dinâmica construída inteiramente com HTML5, CSS3 e Vanilla JavaScript (sem frameworks). O sistema utiliza padrões modernos de arquitetura front-end, roteamento nativo e armazenamento local para simular um banco de dados e controle de sessão em tempo real.

## 🚀 Visão Geral
A Arena Multimarcas permite a navegação por um catálogo dinâmico de roupas e acessórios, possuindo um fluxo de compras de ponta a ponta. O projeto adota um sistema de permissões baseado em funções (RBAC - Role-Based Access Control), entregando experiências diferentes para Clientes e Administradores.

## 🎯 Funcionalidades

### 👤 Visão do Cliente
* **Catálogo Dinâmico:** Navegação fluida por categorias (Camisetas, Calças, Tênis, Relógios, Mochilas).
* **Carrinho de Compras:** Adição de itens com controle rigoroso de limite de estoque.
* **Checkout Inteligente:** Formulário de pagamento reativo (alternância dinâmica entre Débito e Crédito).
* **Histórico de Pedidos:** Acompanhamento do status de compras (ex: "Em preparação 📦") persistido na conta do usuário.

### 🛡️ Visão do Administrador
* **Gestão de Catálogo:** Criação de novos anúncios via Modal com formulário estruturado em grid de duas colunas.
* **Upload de Imagens:** Suporte para conversão de imagens locais (arquivos `.jpg`, `.png`) em Base64 via `FileReader`, ou inserção de URL direta.
* **Exclusão Segura:** Botão exclusivo de remoção de produtos, atualizando toda a grade dinamicamente.

## 🏗️ Arquitetura e Engenharia de Requisitos

O sistema foi desenhado sob um rigoroso mapeamento de requisitos, garantindo isolamento de responsabilidades:

* **Requisitos Evidentes (Interface):** Componentização visual modular (Cards, Navbar, Modais customizados) utilizando a metodologia **BEM** (Block, Element, Modifier) e arquitetura **ITCSS** para escalabilidade de estilos.
* **Requisitos Ocultos (Lógica e Roteamento):** Um motor inteligente de rotas (`slugFromPath`) que analisa o nome do arquivo físico no navegador e instrui um orquestrador centralizado (`main.js`) a renderizar o escopo correto da página sem recarregamentos desnecessários.
* **Requisitos Permanentes (Persistência):** Utilização do `localStorage` como banco de dados principal (`arenaProducts`, `arenaOrders`), garantindo que o catálogo e o histórico de compras sobrevivam ao fechamento do navegador. Dedução matemática exata de estoque no fechamento do pedido.
* **Requisitos Transitórios (Ciclo de Vida):** O controle de autenticação e o estado do carrinho de compras habitam estritamente o `sessionStorage` (`arenaUser`, `arenaCart`), garantindo a volatilidade necessária para segurança de sessão.

## 📁 Estrutura de Diretórios

```text
/
├── css/
│   ├── components/   # Estilos isolados (card.css, modal.css, navbar.css, form.css)
│   ├── tokens/       # Variáveis globais (cores, espaçamentos, tipografia)
│   ├── base.css      # Estilos fundamentais das tags
│   ├── layout.css    # Estruturas de grid e alinhamento
│   ├── reset.css     # Normalização de estilos dos navegadores
│   └── utilities.css # Classes utilitárias de suporte
├── js/
│   └── main.js       # Orquestrador central (Single Script Engine)
├── index.html        # Página raiz / Destaques
├── checkout.html     # Fluxo de finalização de compras
├── orders.html       # Histórico de pedidos do cliente
├── product.html      # Detalhes dinâmicos de um produto único
└── [categorias].html # Páginas limpas injetadas via JavaScript