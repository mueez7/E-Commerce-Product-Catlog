// ---------------------- UNIVERSAL CART ENGINE ---------------------- //

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
    let cart = getCart();
    let item = cart.find(x => x.id === product.id);

    if (item) {
        item.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
}

function removeFromCart(id) {
    let cart = getCart().filter(x => x.id !== id);
    saveCart(cart);
}

function updateQty(id, amount) {
    let cart = getCart();
    let item = cart.find(x => x.id === id);
    if (!item) return;

    item.qty += amount;
    if (item.qty <= 0) {
        cart = cart.filter(x => x.id !== id);
    }

    saveCart(cart);
}
