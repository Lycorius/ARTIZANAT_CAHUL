function fetchAndRenderProducts(category = 'Platouri') {
  fetch('/JSON/items.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("product-container");
      container.innerHTML = ''; // Clear the container before appending new products

      const products = data.produse[category]; // Get the products for the selected category

      products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
          <img class="product-img" src="${product.imagine}" alt="${product.nume}">
          <div class="products-content">
            <p>${product.nume}</p>
            <div class="price-cart">
              <span class="price">${product.pret}</span>
              <span class="cart-icon"><img src="/imagine/COȘ.svg" alt="Cart"></span>
            </div>
          </div>
        `;

        // Append the product to the container
        container.appendChild(productDiv);

        // Add event listener for cart icon click (toggling active state)
        const cartIcon = productDiv.querySelector(".cart-icon");
        cartIcon.addEventListener('click', () => {
          cartIcon.classList.toggle('active');
        });
      });
    })
    .catch(error => console.error('Error loading JSON data:', error));
}

window.onload = function() {
  // Initially load products from the 'Platouri' category
  fetchAndRenderProducts('Platouri');

  // Handle category selection
  const items = document.querySelectorAll('.item');
  
  items.forEach(item => {
    item.addEventListener('click', function() {
      items.forEach(i => i.classList.remove('active')); // Remove 'active' from all categories
      item.classList.add('active'); // Add 'active' to clicked category

      const category = item.getAttribute('data-category');
      fetchAndRenderProducts(category); // Fetch products for the selected category
    });
  });

  // Activate 'Platouri' category on page load
  const platouriCircle = document.querySelector('.item[data-category="Platouri"]');
  if (platouriCircle) {
    platouriCircle.classList.add('active');
  }
};


