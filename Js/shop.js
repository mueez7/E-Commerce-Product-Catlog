const API = "https://dummyjson.com/products?limit=59";
let allProducts = [];

const productsGrid = document.getElementById("productsGrid");
const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const minPriceEl = document.getElementById("minPrice");
const maxPriceEl = document.getElementById("maxPrice");
const applyBtn = document.getElementById("applyBtn");
const resetBtn = document.getElementById("resetBtn");
const emptyState = document.getElementById("emptyState");

async function loadProducts(){
  const res = await fetch(API);
  const data = await res.json();

  const banned = ["groceries", "motorcycle", "liquor"];
  allProducts = data.products.filter(p => !banned.includes(p.category));

  populateCategories();
  renderProducts(allProducts);
}

function populateCategories(){
  const cats = [...new Set(allProducts.map(p => p.category))];

  cats.forEach(c => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c.replace("-", " ").toUpperCase();
    categorySelect.appendChild(o);
  });
}

function createCard(p){
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img class="product-img" src="${p.thumbnail}" alt="${p.title}" />
    <div class="product-title">${p.title}</div>

    <div class="product-meta">
      <span>⭐ ${p.rating}</span>
      <span class="product-price">$${p.price}</span>
    </div>

    <div class="product-buttons">
      <button class="add-cart-btn">Add</button>
      <button class="buy-btn">Buy</button>
    </div>
  `;

  // FIXED — Add to cart instantly, no refresh needed
  card.querySelector(".add-cart-btn").onclick = () => {
    addToCart(p);
    showToast("Added to cart");
    
  };

  return card;
}

function renderProducts(list){
  productsGrid.innerHTML = "";

  if(list.length === 0){
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  list.forEach(p => productsGrid.appendChild(createCard(p)));
}

function applyFilters(){
  let f = [...allProducts];

  const q = searchInput.value.toLowerCase();
  const cat = categorySelect.value;
  const min = minPriceEl.value ? Number(minPriceEl.value) : null;
  const max = maxPriceEl.value ? Number(maxPriceEl.value) : null;

  if(q) f = f.filter(p => (p.title + p.description).toLowerCase().includes(q));
  if(cat) f = f.filter(p => p.category === cat);
  if(min !== null) f = f.filter(p => p.price >= min);
  if(max !== null) f = f.filter(p => p.price <= max);

  renderProducts(f);
}

resetBtn.onclick = () => {
  searchInput.value = "";
  categorySelect.value = "";
  minPriceEl.value = "";
  maxPriceEl.value = "";
  renderProducts(allProducts);
};

applyBtn.onclick = applyFilters;
searchInput.oninput = applyFilters;

loadProducts();

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}