document.getElementById('sellForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch('http://localhost:5000/api/products/add', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to add product');
        }

        alert('Product added successfully');
        e.target.reset();
        loadProducts(); // Reload products after adding a new one
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding product');
    }
});

// Fetch and display products
// Fetch and display products
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products/get');
        const products = await response.json();

        const container = document.getElementById('productList');
        container.innerHTML = products.map(p => `
            <div class="product-card">
                <img src="${p.imageUrl || 'default-image.jpg'}" alt="${p.name || 'No Name'}" width="100">
                <h3>${p.name || 'No Name'} (${p.category || 'N/A'})</h3>
                <p><strong>Description:</strong> ${p.description || 'No description available'}</p>
                <p><strong>Price:</strong> $${p.price ?? 'Not provided'}</p>
                <p><strong>Quantity:</strong> ${p.quantity ?? 'Unknown'}</p>
                <p><strong>Manufactured Date:</strong> ${p.manufacturedDate ? new Date(p.manufacturedDate).toLocaleDateString() : 'Not available'}</p>
                <p><strong>Delivery Options:</strong> ${p.deliveryOptions?.length ? p.deliveryOptions.join(', ') : 'No options available'}</p>
                <p><strong>Quality Grade:</strong> ${p.qualityGrade || 'Not specified'}</p>
                <p><strong>Seller Name:</strong> ${p.sellerName || 'Anonymous'}</p>
                <p><strong>Contact:</strong> ${p.contact || 'Not available'}</p>
                <p><strong>Location:</strong> ${p.location || 'Not available'}</p>
                <button onclick="addToCart('${p._id}')">Add to Cart</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
}


// Add to Cart
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(id);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart');
}

// Load products on page load
document.addEventListener('DOMContentLoaded', loadProducts);
