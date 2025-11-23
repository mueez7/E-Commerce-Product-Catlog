    // Navigate helper
    function navigateToShop(){
      window.location.href = "shop.html";
    }

    function subscribe(){
      const e = document.getElementById("newsletterEmail").value.trim();
      if(!e) return alert("Enter your email");
      alert("Subscribed: " + e);
      document.getElementById("newsletterEmail").value = "";
    }

    // Render card HTML (consistent with shop)
    function productCardHtml(p){
      return `
        <div class="card" data-id="${p.id}">
          <div class="img-wrap"><img src="${p.thumbnail || (p.images && p.images[0])}" alt="${escapeHtml(p.title)}"></div>
          <div class="name">${escapeHtml(p.title)}</div>
          <div class="meta">
            <div>⭐ ${p.rating}</div>
            <div class="price">$${p.price}</div>
          </div>
          <div class="actions">
            <button class="add" onclick='addToCartFromHome(${JSON.stringify(p)})'>Add</button>
            <button class="buy" onclick='buyNowFromHome(${JSON.stringify(p)})'>Buy </button>
          </div>
        </div>
      `;
    }

    // simple escape
    function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    // Use DummyJSON for product images and details
    const API = "https://dummyjson.com/products?limit=60";

    async function loadHomeProducts(){
      try{
        const res = await fetch(API);
        const data = await res.json();
        const products = (data.products || []).filter(p => !p.category.includes("groceries"));

        // Fill recommended (take first 8 electronics/music)
        const recommended = products.filter(p => ["smartphones","laptops","audio","fragrances","home-decoration","lighting","computers"].includes(p.category)).slice(0,8);
        document.getElementById("recommended").innerHTML = recommended.map(productCardHtml).join("");

        // best-selling (random pick 10)
        const best = products.slice(8, 18);
        document.getElementById("best-selling").innerHTML = best.map(productCardHtml).join("");
      }catch(err){
        console.error(err);
      }
    }

    // ---------- CART integration for Home page ----------
    // Keep cart consistent with shop/cart pages.
    function getCart(){ return JSON.parse(localStorage.getItem("cart")||"[]"); }
    function saveCart(c){ localStorage.setItem("cart", JSON.stringify(c)); updateCartBadge(); }

    function addToCartFromHome(product){
      const cart = getCart();
      const exists = cart.find(i => i.id === product.id);
      if(exists) exists.qty++;
      else cart.push({...product, qty:1});
      saveCart(cart);
      showToast("Added to cart");
    }

    function buyNowFromHome(p){
      addToCartFromHome(p);
      window.location.href = "cart.html";
    }

    // small notification
    function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
    function updateCartBadge(){
      // if you have a badge, add logic here. currently header icon is static.
    }

    // Initialize
    loadHomeProducts();