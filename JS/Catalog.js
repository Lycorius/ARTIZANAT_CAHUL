function fetchAndRenderProducts(category = "Platouri", page = 1) {
    fetch("/JSON/items.json")
        .then((response) => response.json())
        .then((data) => {
            const products = data.produse[category];
            const productsPerPage = 12;
            const startIndex = (page - 1) * productsPerPage;
            const endIndex = page * productsPerPage;
            const paginatedProducts = products.slice(startIndex, endIndex);
            const container = document.getElementById("product-container");
            container.innerHTML = '';

            paginatedProducts.forEach((product) => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product");
                productDiv.innerHTML = `
                    <a href="/HTML/Produs.html?id=${product.id}&categorie=${product.categorie}">
                        <img class="product-img" src="${product.imagine}" alt="${product.nume}" data-id="${product.id}">
                    </a>
                    <div class="products-content">
                        <p>${product.nume}</p>
                        <div class="price-cart">
                            <span class="price">${product.pret}</span>
                            <button class="cart-icon" title="Adaugă în coș">
                                <img src="/imagine/COȘ.svg" alt="Cart">
                            </button>
                        </div>
                    </div>
                `;

                const cartButton = productDiv.querySelector(".cart-icon");
                cartButton.addEventListener("click", () => addToCart(product));
                
                container.appendChild(productDiv);
            });

            renderPagination(category, products.length, page);
        })
        .catch((error) => console.error("Error loading JSON data:", error));
}

function renderPagination(category, totalProducts, currentPage) {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalProducts / 12);

  if (currentPage > 1) {
    const prevPage = document.createElement("span");
    prevPage.classList.add("prev-page");
    prevPage.innerHTML =
      '<img src="/imagine/left-arrow.svg" alt="Previous Page">';
    prevPage.addEventListener("click", () =>
      fetchAndRenderProducts(category, currentPage - 1)
    );
    paginationContainer.appendChild(prevPage);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageNumber = document.createElement("span");
    pageNumber.classList.add("page-number");
    pageNumber.textContent = i;
    if (i === currentPage) pageNumber.classList.add("active");
    pageNumber.addEventListener("click", () =>
      fetchAndRenderProducts(category, i)
    );
    paginationContainer.appendChild(pageNumber);
  }

  if (currentPage < totalPages) {
    const nextPage = document.createElement("span");
    nextPage.classList.add("next-page");
    nextPage.innerHTML = '<img src="/imagine/Right-arrow.svg" alt="Next Page">';
    nextPage.addEventListener("click", () =>
      fetchAndRenderProducts(category, currentPage + 1)
    );
    paginationContainer.appendChild(nextPage);
  }
}

function showNotification(product) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
        <div class="notification-content">
            <img src="${product.imagine}" alt="${product.nume}" class="notification-img">
            <div class="notification-text">
                <p class="notification-title" data-lang="notification-added">Adăugat în coș</p>
                <p class="notification-product">${product.nume}</p>
            </div>
        </div>
        <div class="notification-actions">
            <a href="/HTML/COS.html" class="view-cart" data-lang="notification-view-cart">Vezi coșul</a>
        </div>
    `;
    
    const languageManager = new LanguageManager(translations);
    languageManager.updateContent();
    
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            nume: product.nume,
            pret: product.pret,
            imagine: product.imagine,
            categorie: product.categorie,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(product);
}

function updateCartCount() {
    const cartCount = document.querySelectorAll('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCount.forEach(count => {
        count.textContent = totalItems;
    });
}

const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s, transform 0.3s;
        z-index: 1000;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .cart-icon {
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
        transition: transform 0.2s;
    }
    
    .cart-icon:hover {
        transform: scale(1.1);
    }
`;

document.head.appendChild(style);

window.onload = function () {
  fetchAndRenderProducts("Platouri");

  const items = document.querySelectorAll(".item");
  items.forEach((item) => {
    item.addEventListener("click", function () {
      items.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");

      const category = this.getAttribute("data-category");
      fetchAndRenderProducts(category);
    });
  });

  const platouriCircle = document.querySelector(
    '.item[data-category="Platouri"]'
  );
  if (platouriCircle) platouriCircle.classList.add("active");
};

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchAndRenderProducts();
});
