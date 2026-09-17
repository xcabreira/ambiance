'use strict';

// ======================== Configuration ========================
// Use DDI + DDD + número, somente dígitos. Exemplo de formato brasileiro: 55 + DDD + número.
const WHATSAPP_NUMBER = 'INSERIR_NUMERO';
const CONFIG = {
  instagram: 'https://www.instagram.com/lojaambiance?stkn=M2VpNWsyMW5iMng4',
  siteUrl: '', // URL pública final, terminada em /.
  address: '', // Endereço real da Ambiance.
  hours: '', // Horários reais. Use \n para separar dias.
  phoneLabel: '', // Telefone formatado, opcional.
  mapsUrl: '', // Link real do Google Maps.
};
const GENERAL_MESSAGE = 'Olá! Conheci a Ambiance pelo site e gostaria de conhecer melhor os produtos.';
// Todos os registros abaixo são PLACEHOLDERS, não produtos reais da Ambiance.
// Substitua pelos dados autorizados da empresa e defina demonstrativo: false.
const produtos = [
  { id: 'demo-01', nome: 'Móvel · demonstração', categoria: 'Móveis', imagem: 'assets/images/products/movel-placeholder.svg', galeria: ['assets/images/products/movel-placeholder.svg', 'assets/images/products/detalhe-placeholder.svg'], descricao: 'Espaço reservado para apresentar um móvel real da Ambiance. Nome, fotografias e características serão substituídos pelos dados da loja.', material: 'A informar pela loja', medidas: 'A informar pela loja', destaque: true, demonstrativo: true },
  { id: 'demo-02', nome: 'Objeto · demonstração', categoria: 'Decoração', imagem: 'assets/images/products/objeto-placeholder.svg', galeria: ['assets/images/products/objeto-placeholder.svg', 'assets/images/products/detalhe-placeholder.svg'], descricao: 'Espaço reservado para um objeto de decoração real. Este item serve apenas para demonstrar a experiência do catálogo.', material: 'A informar pela loja', medidas: 'A informar pela loja', destaque: true, demonstrativo: true },
  { id: 'demo-03', nome: 'Luminária · demonstração', categoria: 'Iluminação', imagem: 'assets/images/products/luminaria-placeholder.svg', galeria: ['assets/images/products/luminaria-placeholder.svg', 'assets/images/products/detalhe-placeholder.svg'], descricao: 'Espaço reservado para uma peça real de iluminação, com suas fotografias e especificações.', material: 'A informar pela loja', medidas: 'A informar pela loja', destaque: true, demonstrativo: true },
  { id: 'demo-04', nome: 'Poltrona · demonstração', categoria: 'Móveis', imagem: 'assets/images/products/poltrona-placeholder.svg', galeria: ['assets/images/products/poltrona-placeholder.svg', 'assets/images/products/detalhe-placeholder.svg'], descricao: 'Espaço reservado para uma poltrona real da loja. Nenhum modelo ou acabamento está sendo anunciado.', material: 'A informar pela loja', medidas: 'A informar pela loja', destaque: true, demonstrativo: true },
  { id: 'demo-05', nome: 'Vaso · demonstração', categoria: 'Decoração', imagem: 'assets/images/products/vaso-placeholder.svg', galeria: ['assets/images/products/vaso-placeholder.svg', 'assets/images/products/detalhe-placeholder.svg'], descricao: 'Espaço reservado para fotografias e informações de um vaso real, selecionado pela Ambiance.', material: 'A informar pela loja', medidas: 'A informar pela loja', destaque: false, demonstrativo: true },
  { id: 'demo-06', nome: 'Peça · demonstração', categoria: 'Objetos', imagem: 'assets/images/products/peca-placeholder.svg', galeria: ['assets/images/products/peca-placeholder.svg', 'assets/images/products/detalhe-placeholder.svg'], descricao: 'Espaço reservado para uma peça real do acervo. Consulte o Instagram para conhecer os produtos da loja.', material: 'A informar pela loja', medidas: 'A informar pela loja', destaque: false, demonstrativo: true },
];

// ======================== DOM Elements ========================
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const dom = { header: $('#header'), menu: $('#mobile-menu'), menuToggle: $('#menu-toggle'), grid: $('#product-grid'), filters: $('#filters'), modal: $('#product-modal'), track: $('#highlights-track') };
const state = { product: null, images: [], imageIndex: 0, lastFocus: null, menuFocus: null, touchStart: null };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
function safeImagePath(value) {
  if (typeof value !== 'string') return 'assets/images/products/detalhe-placeholder.svg';
  return /^(https?:\/\/|\.?\/?assets\/)/i.test(value) ? value : 'assets/images/products/detalhe-placeholder.svg';
}
function syncScrollLock() { document.body.classList.toggle('locked', dom.menu.open || dom.modal.open); }

// ======================== Navigation ========================
function closeMenu() { if (dom.menu.open) dom.menu.close(); }
function initializeNavigation() {
  dom.menuToggle.hidden = false;
  dom.menuToggle.addEventListener('click', () => {
    state.menuFocus = document.activeElement;
    dom.menu.showModal();
    dom.menuToggle.setAttribute('aria-expanded', 'true');
    syncScrollLock();
    $('#menu-close').focus();
  });
  $('#menu-close').addEventListener('click', closeMenu);
  dom.menu.addEventListener('close', () => {
    dom.menuToggle.setAttribute('aria-expanded', 'false');
    syncScrollLock();
    if (state.menuFocus?.isConnected) state.menuFocus.focus({ preventScroll: true });
  });
  $$('nav a', dom.menu).forEach(link => link.addEventListener('click', () => {
    const target = $(link.hash);
    closeMenu();
    if (target) requestAnimationFrame(() => {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    });
  }));
  window.matchMedia('(min-width:1200px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
}

// ======================== Header ========================
function initializeHeader() {
  let pending = false;
  const update = () => { dom.header.classList.toggle('scrolled', window.scrollY > 30); pending = false; };
  window.addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// ======================== WhatsApp ========================
function hasWhatsAppNumber() { return /^[1-9]\d{9,14}$/.test(WHATSAPP_NUMBER); }
function createWhatsAppLink(message = GENERAL_MESSAGE) {
  // Não cria links quebrados ou números fictícios na ausência do telefone real.
  if (!hasWhatsAppNumber()) return CONFIG.instagram;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function productMessage(product) {
  return product.demonstrativo
    ? 'Olá! Conheci a apresentação da Ambiance e gostaria de ver as peças reais disponíveis.'
    : `Olá! Vi o produto ${product.nome} no catálogo da Ambiance e gostaria de mais informações.`;
}
function initializeContact() {
  $$('[data-instagram]').forEach(link => { link.href = CONFIG.instagram; });
  $$('[data-contact]').forEach(link => {
    link.href = createWhatsAppLink();
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  $('#contact-hint').textContent = hasWhatsAppNumber() ? 'Atendimento pelo WhatsApp. Disponibilidade das peças sob consulta.' : 'Atendimento pelo Instagram.';
  $('#footer-whatsapp').hidden = !hasWhatsAppNumber();
  if (CONFIG.address.trim()) { $('#address').textContent = CONFIG.address; $('#address-block').hidden = false; }
  if (/^https:\/\//i.test(CONFIG.mapsUrl)) {
    $('#maps-link').href = CONFIG.mapsUrl; $('#maps-link').hidden = false; $('#address-block').hidden = false;
  }
  if (CONFIG.hours.trim()) { $('#hours').textContent = CONFIG.hours; $('#hours-block').hidden = false; }
  if (hasWhatsAppNumber()) { $('#phone').textContent = CONFIG.phoneLabel || `+${WHATSAPP_NUMBER}`; $('#phone-block').hidden = false; }
  $('#contact-details').hidden = !$$('#contact-details > div').some(block => !block.hidden);
  if (/^https:\/\//i.test(CONFIG.siteUrl)) {
    let canonical = $('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = CONFIG.siteUrl;
  }
}

// ======================== Products ========================
function productCard(product) {
  return `<article class="product-card"><button class="product-image-button" data-product="${escapeHTML(product.id)}" aria-label="Ver detalhes: ${escapeHTML(product.nome)}"><img src="${escapeHTML(safeImagePath(product.imagem))}" width="800" height="1000" loading="lazy" decoding="async" alt="${escapeHTML(product.demonstrativo ? 'Imagem reservada para ' + product.categoria.toLowerCase() : product.nome)}">${product.demonstrativo ? '<span class="product-label">DEMONSTRATIVO</span>' : ''}</button><div class="product-info"><p class="product-category">${escapeHTML(product.categoria)}</p><h3>${escapeHTML(product.nome)}</h3><div class="product-actions"><button data-product="${escapeHTML(product.id)}" aria-label="Ver detalhes: ${escapeHTML(product.nome)}">Ver detalhes <span aria-hidden="true">↗</span></button><a href="${escapeHTML(createWhatsAppLink(productMessage(product)))}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(product.demonstrativo ? 'Consultar peças reais na Ambiance' : 'Consultar ' + product.nome)}">Consultar <span aria-hidden="true">↗</span></a></div></div></article>`;
}
function renderProducts(category = 'Todos') {
  const visible = category === 'Todos' ? produtos : produtos.filter(product => product.categoria === category);
  dom.grid.innerHTML = visible.length ? visible.map(productCard).join('') : '<p class="empty-state">Novas peças em breve. Converse com a Ambiance para conhecer a seleção atual.</p>';
  $('#product-count').textContent = `${visible.length} ${visible.length === 1 ? 'peça exibida' : 'peças exibidas'}. ${category}.`;
}
function renderHighlights() {
  const highlights = produtos.filter(product => product.destaque).slice(0, 8);
  dom.track.innerHTML = highlights.map(productCard).join('');
  $('#destaques').hidden = highlights.length === 0;
  $('.slider-controls').hidden = highlights.length < 2;
  updateHighlightControls();
}

// ======================== Filters ========================
function filterProducts(category) {
  $$('.filter', dom.filters).forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
  renderProducts(category);
}
function initializeFilters() {
  const categories = ['Todos', ...new Set(produtos.map(product => product.categoria).filter(Boolean))];
  dom.filters.innerHTML = categories.map((category, index) => `<button class="filter" data-category="${escapeHTML(category)}" aria-pressed="${index === 0}">${escapeHTML(category)}</button>`).join('');
  dom.filters.addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (button) filterProducts(button.dataset.category); });
}

// ======================== Product Modal & Gallery ========================
function openProductModal(id) {
  const product = produtos.find(item => String(item.id) === String(id));
  if (!product) return;
  state.product = product;
  state.lastFocus = document.activeElement;
  state.images = [...new Set([product.imagem, ...(product.galeria || [])].filter(Boolean))].map(safeImagePath);
  if (!state.images.length) state.images = ['assets/images/products/detalhe-placeholder.svg'];
  state.imageIndex = 0;
  $('#modal-title').textContent = product.nome;
  $('#modal-category').textContent = product.categoria;
  $('#modal-description').textContent = product.descricao || '';
  $('#modal-material').textContent = product.material || 'Consultar';
  $('#modal-dimensions').textContent = product.medidas || 'Consultar';
  $('#modal-demo').hidden = !product.demonstrativo;
  $('#modal-availability').textContent = product.demonstrativo ? 'Este exemplo não indica disponibilidade. Consulte as peças reais com a loja.' : 'Disponibilidade sob consulta.';
  $('#modal-contact').href = createWhatsAppLink(productMessage(product));
  $('#modal-contact-label').textContent = hasWhatsAppNumber() ? 'Consultar pelo WhatsApp' : 'Consultar pelo Instagram';
  $('#gallery-thumbnails').innerHTML = state.images.map((source, index) => `<button data-image-index="${index}" aria-label="Ver imagem ${index + 1}" aria-pressed="${index === 0}"><img src="${escapeHTML(source)}" width="80" height="80" alt="" loading="lazy"></button>`).join('');
  $('#gallery-thumbnails').hidden = state.images.length < 2;
  $('#gallery-controls').hidden = state.images.length < 2;
  showGalleryImage(0);
  dom.modal.showModal();
  dom.modal.scrollTop = 0;
  syncScrollLock();
  $('#modal-close').focus({ preventScroll: true });
}
function closeProductModal() { if (dom.modal.open) dom.modal.close(); }
function showGalleryImage(index) {
  if (!state.images.length) return;
  state.imageIndex = (index + state.images.length) % state.images.length;
  $('#modal-image').src = state.images[state.imageIndex];
  $('#modal-image').alt = `${state.product.demonstrativo ? 'Imagem demonstrativa' : state.product.nome} — imagem ${state.imageIndex + 1} de ${state.images.length}`;
  $('#gallery-count').textContent = `${state.imageIndex + 1} / ${state.images.length}`;
  $$('[data-image-index]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.imageIndex) === state.imageIndex)));
}
function initializeProductModal() {
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-product]');
    if (button) openProductModal(button.dataset.product);
  });
  $('#modal-close').addEventListener('click', closeProductModal);
  // O dialog nativo contém o foco e fecha com Escape, inclusive sem bibliotecas.
  dom.modal.addEventListener('close', () => {
    syncScrollLock();
    if (state.lastFocus?.isConnected) state.lastFocus.focus({ preventScroll: true });
  });
  let backdropStart = false;
  const outsideModal = event => {
    const rect = dom.modal.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dom.modal.addEventListener('pointerdown', event => { backdropStart = outsideModal(event); });
  dom.modal.addEventListener('click', event => { if (backdropStart && outsideModal(event)) closeProductModal(); backdropStart = false; });
  $('#gallery-prev').addEventListener('click', () => showGalleryImage(state.imageIndex - 1));
  $('#gallery-next').addEventListener('click', () => showGalleryImage(state.imageIndex + 1));
  $('#gallery-thumbnails').addEventListener('click', event => {
    const button = event.target.closest('[data-image-index]');
    if (button) showGalleryImage(Number(button.dataset.imageIndex));
  });
  dom.modal.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showGalleryImage(state.imageIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  const stage = $('#gallery-stage');
  stage.addEventListener('touchstart', event => { state.touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!state.touchStart) return;
    const dx = event.changedTouches[0].clientX - state.touchStart.x;
    const dy = event.changedTouches[0].clientY - state.touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) showGalleryImage(state.imageIndex + (dx < 0 ? 1 : -1));
    state.touchStart = null;
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { state.touchStart = null; }, { passive: true });
}

// ======================== Scroll Effects ========================
function updateHighlightControls() {
  $('#previous-highlight').disabled = dom.track.scrollLeft <= 2;
  $('#next-highlight').disabled = dom.track.scrollLeft + dom.track.clientWidth >= dom.track.scrollWidth - 2;
}
function moveHighlights(direction) {
  const card = $('.product-card', dom.track);
  if (!card) return;
  dom.track.scrollBy({ left: direction * (card.getBoundingClientRect().width + 22), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
function initializeHighlights() {
  $('#previous-highlight').addEventListener('click', () => moveHighlights(-1));
  $('#next-highlight').addEventListener('click', () => moveHighlights(1));
  dom.track.addEventListener('scroll', updateHighlightControls, { passive: true });
  window.addEventListener('resize', updateHighlightControls, { passive: true });
  dom.track.addEventListener('keydown', event => {
    if (event.target === dom.track && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); moveHighlights(event.key === 'ArrowRight' ? 1 : -1); }
  });
}

// ======================== Animations ========================
function initializeAnimations() {
  if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('show'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  $$('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('motion');
}
function initializeImageFallbacks() {
  document.addEventListener('error', event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || image.dataset.fallback) return;
    image.dataset.fallback = 'true';
    image.src = 'assets/images/products/detalhe-placeholder.svg';
    image.alt = 'Fotografia indisponível — consulte a Ambiance para ver esta peça.';
  }, true);
}

// ======================== Initialization ========================
function initialize() {
  initializeImageFallbacks();
  initializeContact();
  initializeFilters();
  renderProducts();
  renderHighlights();
  initializeProductModal();
  initializeNavigation();
  initializeHeader();
  initializeHighlights();
  $('#year').textContent = new Date().getFullYear();
  document.documentElement.classList.add('js');
  initializeAnimations();
}
initialize();
