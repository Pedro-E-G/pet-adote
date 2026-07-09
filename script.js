// script.js – PetShop Amigo (protótipo)

// ===== BASE DE PRODUTOS =====
const produtos = [
  // Animais
  { id: 1, nome: 'Filhote de Golden', categoria: 'animais', preco: 3200, emoji: '🐕' },
  { id: 2, nome: 'Gato Siames', categoria: 'animais', preco: 2100, emoji: '🐈' },
  { id: 3, nome: 'Coelho Mini', categoria: 'animais', preco: 450, emoji: '🐇' },
  { id: 4, nome: 'Calopsita', categoria: 'animais', preco: 780, emoji: '🐦' },
  // Comidas
  { id: 5, nome: 'Ração Premium Cães', categoria: 'comida', preco: 89.90, emoji: '🍖' },
  { id: 6, nome: 'Sachê para Gatos', categoria: 'comida', preco: 34.50, emoji: '🐟' },
  { id: 7, nome: 'Petisco Natural', categoria: 'comida', preco: 19.99, emoji: '🦴' },
  { id: 8, nome: 'Ração Hamster', categoria: 'comida', preco: 27.30, emoji: '🌾' },
  // Acessórios
  { id: 9, nome: 'Cama Redonda', categoria: 'acessorio', preco: 149.90, emoji: '🛏️' },
  { id: 10, nome: 'Coleira Anti-puxão', categoria: 'acessorio', preco: 79.00, emoji: '⛓️' },
  { id: 11, nome: 'Bebedouro Automático', categoria: 'acessorio', preco: 119.00, emoji: '💧' },
  { id: 12, nome: 'Brinquedo Mordedor', categoria: 'acessorio', preco: 39.90, emoji: '🧸' },
];

// ===== ESTADO =====
let carrinho = [];
let filtroAtual = 'todos';

// ===== ELEMENTOS DOM =====
const grid = document.getElementById('productGrid');
const cartBadge = document.getElementById('cartBadge');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===== RENDERIZA PRODUTOS =====
function renderizarProdutos() {
  const filtrados = filtroAtual === 'todos' 
    ? produtos 
    : produtos.filter(p => p.categoria === filtroAtual);

  if (filtrados.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:2rem; color:#6b5d4f;">Nenhum produto nesta categoria.</p>`;
    return;
  }

  grid.innerHTML = filtrados.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">${p.emoji}</div>
      <div class="product-name">${p.nome}</div>
      <div class="product-category">${p.categoria}</div>
      <div class="product-price">R$ ${p.preco.toFixed(2)}</div>
      <button class="btn-add" data-id="${p.id}">Adicionar</button>
    </div>
  `).join('');

  // Adiciona eventos aos botões "Adicionar"
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.dataset.id);
      adicionarAoCarrinho(id);
    });
  });
}

// ===== CARRINHO =====
function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  // Verifica se já existe no carrinho
  const existente = carrinho.find(item => item.id === id);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  atualizarBadge();
  // feedback simples
  const btn = document.querySelector(`.btn-add[data-id="${id}"]`);
  if (btn) {
    const original = btn.textContent;
    btn.textContent = '✓ Adicionado';
    btn.style.backgroundColor = '#4a7c59';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.backgroundColor = '#b68a6b';
    }, 900);
  }
}

function atualizarBadge() {
  const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  cartBadge.textContent = total;
}

// ===== FILTROS =====
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroAtual = btn.dataset.filter;
    renderizarProdutos();
  });
});

// ===== INICIALIZA =====
renderizarProdutos();
atualizarBadge();

// (Extra) Clique no carrinho mostra um alerta com os itens (protótipo)
document.getElementById('cartIcon').addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert('🛒 Seu carrinho está vazio.');
    return;
  }
  const mensagem = carrinho.map(item => 
    `${item.emoji} ${item.nome} – ${item.quantidade}x (R$ ${(item.preco * item.quantidade).toFixed(2)})`
  ).join('\n');
  const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  alert(`🛍️ CARRINHO:\n${mensagem}\n\n💰 Total: R$ ${totalCarrinho.toFixed(2)}`);
});
