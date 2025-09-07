// Product Management System - Optimized Single Source
class ProductManager {
    constructor() {
        this.products = [];
        this.currentProduct = null;
        this.isDataLoaded = false;
        this.dataSource = null;
        this.loadProducts();
    }

    // Load products from fallback data (single source of truth)
    async loadProducts() {
        // Jika data sudah dimuat, return data yang ada
        if (this.isDataLoaded && this.products.length > 0) {
            return this.products;
        }

        // Strategi 1: Gunakan fallbackProductData jika tersedia
        if (window.fallbackProductData && Array.isArray(window.fallbackProductData)) {
            console.log('✅ Loading products from fallback data...');
            this.products = window.fallbackProductData;
            this.isDataLoaded = true;
            this.dataSource = 'FALLBACK_DATA';
            console.log('✅ Successfully loaded from fallback data:', this.products.length, 'products');
            return this.products;
        }

        // Strategi 2: Minimal demo jika fallback tidak ada
        console.log('⚠️ Fallback data not found, using minimal demo data...');
        this.products = this.getMinimalDemoData();
        this.isDataLoaded = true;
        this.dataSource = 'DEMO';
        console.log('⚠️ Using demo data:', this.products.length, 'products');
        return this.products;
    }

    // Hanya 3 produk minimal untuk demo jika semua gagal
    getMinimalDemoData() {
        return [
            {
                id: 1, name: "Pearl Whisper Flats", price: 329000, image: "Images/product1.jpg.jpg", 
                category: "Ballet Flats", description: "Ballet flats putih dengan aksen pita dan charm mutiara & hati metalik.",
                longDescription: "Ballet Flats Beige menghadirkan keanggunan yang sederhana dalam balutan warna putih bersih. Dengan ornamen mutiara dan pita halus di bagian depan, sepatu ini sempurna untuk penampilan sehari-hari yang stylish namun tetap nyaman. Sol datar yang fleksibel membuatnya cocok untuk aktivitas harian tanpa mengurangi gaya",
                features: ["Material premium", "Sol anti-slip", "Desain timeless"], 
                sizes: ["36", "37", "38", "39", "40"], colors: ["White Pearl"], stock: 40, 
                rating: 4.8, reviews: 24, isNew: true, isFeatured: true
            },
            {
                id: 2, name: "Blush Charm", price: 349000, image: "Images/product2.jpg.png",
                category: "Ballet Flats", description: "Ballet Flats pink satin dengan crisscross strap dan detail beads metalik. Desain feminin yang lembut.",
                longDescription: "Blush Charm Flats memberikan sentuhan feminim dan lembut dalam warna pink pastel. Detail mutiara pada pita depan menambah kesan manis dan elegan, cocok dipadupadankan dengan berbagai outfit casual maupun semi formal untuk tampilan yang segar dan chic.",
                features: ["Kulit berkualitas", "Cushion comfort", "Desain minimalis"],
                sizes: ["36", "37", "38", "39", "40"], colors: ["Soft Pink"], stock: 40,
                rating: 4.8, reviews: 18, isNew: false, isFeatured: true
            },
            {
                id: 3, name: "Sky Pearl Flats", price: 379000, image: "Images/product3.jpg.png",
                category: "Ballet Flats", description: "Ballets biru pastel dengan aksen pita dan charm mutiara, menghadirkan nuansa fresh & anggun.",
                longDescription: "Sky Grace Flats memadukan kenyamanan dengan keindahan berbalut warna biru pastel. Ornamen mutiara yang terpasang rapi pada tali depan memberikan aksen unik dan subtle. Sepatu ini cocok untuk Anda yang ingin tampil beda namun tetap simple dan elegan.",
                features: ["Hak 7cm", "Material suede", "Pointed toe"],
                sizes: ["36", "37", "38", "39", "40"], colors: ["Soft Blue"], stock: 40,
                rating: 4.8, reviews: 31, isNew: false, isFeatured: true
            }
        ];
    }

    // Get data source info for debugging
    getDataSourceInfo() { 
        return {
            source: this.dataSource,
            productCount: this.products.length,
            isLoaded: this.isDataLoaded
        };
    }

    // Get all products
    getAllProducts() {
        return this.products;
    }

    // Get featured products
    getFeaturedProducts() {
        return this.products.filter(product => product.isFeatured);
    }

    // Get new products
    getNewProducts() {
        return this.products.filter(product => product.isNew);
    }

    // Get product by ID
    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    // Get products by category
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    // Search products
    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    // Get product by name (for compatibility with existing cart system)
    getProductByName(name) {
        return this.products.find(product => product.name === name);
    }

    // Format price to Indonesian Rupiah
    formatPrice(price) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    }

    // Generate star rating HTML
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    // Render product card HTML
    renderProductCard(product) {
        const formattedPrice = this.formatPrice(product.price);
        const stars = this.generateStarRating(product.rating);
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                ${product.isNew ? '<div class="product-badge new">New</div>' : ''}
                ${product.isFeatured ? '<div class="product-badge featured">Featured</div>' : ''}
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formattedPrice}</p>
                    <div class="product-rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-text">(${product.reviews} reviews)</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-buttons">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-primary">Detail</a>
                        <button class="btn btn-secondary" onclick="addToCart('${product.name}', ${product.price})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Render products grid
    async renderProductsGrid(containerId, filter = 'all') {
        await this.loadProducts(); // Ensure products are loaded
        
        const container = document.getElementById(containerId);
        if (!container) return;

        let productsToShow = [];
        
        switch (filter) {
            case 'featured':
                productsToShow = this.getFeaturedProducts();
                break;
            case 'new':
                productsToShow = this.getNewProducts();
                break;
            case 'all':
            default:
                productsToShow = this.getAllProducts();
                break;
        }

        const productsHTML = productsToShow.map(product => this.renderProductCard(product)).join('');
        container.innerHTML = productsHTML;
    }

    // Set current product for detail page
    setCurrentProduct(productId) {
        this.currentProduct = this.getProductById(productId);
        return this.currentProduct;
    }

    // Get current product
    getCurrentProduct() {
        return this.currentProduct;
    }
}

// Create global instance
const productManager = new ProductManager();

// Utility function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to initialize products on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Check if we're on the main page with products grid
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        await productManager.renderProductsGrid('products-grid', 'all');
    }
    
    // Check if we're on a product detail page
    const productId = getUrlParameter('id');
    if (productId && window.location.pathname.includes('product-detail.html')) {
        await loadProductDetail(productId);
    }
});

// Function to load product detail
async function loadProductDetail(productId) {
    await productManager.loadProducts();
    const product = productManager.setCurrentProduct(productId);
    
    if (!product) {
        console.error('Product not found');
        return;
    }
    
    // Update page title
    document.title = `${product.name} - Auréa & Co Fashion Store`;
    
    // Render product detail
    renderProductDetail(product);
}

// Function to render product detail page
function renderProductDetail(product) {
    const formattedPrice = productManager.formatPrice(product.price);
    const stars = productManager.generateStarRating(product.rating);
    
    // Update product images
    const mainImage = document.querySelector('.product-main-image');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }
    
    // Update product info
    const productName = document.querySelector('.product-title');
    if (productName) productName.textContent = product.name;
    
    const productPrice = document.querySelector('.product-price');
    if (productPrice) productPrice.textContent = formattedPrice;
    
    const productCategory = document.querySelector('.product-category');
    if (productCategory) productCategory.textContent = product.category;
    
    const productDescription = document.querySelector('.product-description');
    if (productDescription) productDescription.textContent = product.longDescription;
    
    const productRating = document.querySelector('.product-rating');
    if (productRating) {
        productRating.innerHTML = `
            <div class="stars">${stars}</div>
            <span class="rating-value">${product.rating}</span>
            <span class="reviews-count">(${product.reviews} reviews)</span>
        `;
    }
    
    // Update features list
    const featuresList = document.querySelector('.features-list');
    if (featuresList && product.features) {
        featuresList.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
    }
    
    // Update sizes
    const sizeOptions = document.querySelector('.size-options');
    if (sizeOptions && product.sizes) {
        sizeOptions.innerHTML = product.sizes.map(size => 
            `<button class="size-option" data-size="${size}">${size}</button>`
        ).join('');
    }
    
    // Update colors
    const colorOptions = document.querySelector('.color-options');
    if (colorOptions && product.colors) {
        colorOptions.innerHTML = product.colors.map(color => 
            `<button class="color-option" data-color="${color}" title="${color}">
                <span class="color-sample" style="background-color: ${getColorCode(color)}"></span>
                ${color}
            </button>`
        ).join('');
    }
    
    // Update stock info
    const stockInfo = document.querySelector('.stock-info');
    if (stockInfo) {
        const stockStatus = product.stock > 0 ? 'In Stock' : 'Out of Stock';
        const stockClass = product.stock > 0 ? 'in-stock' : 'out-of-stock';
        stockInfo.innerHTML = `<span class="${stockClass}">${stockStatus} (${product.stock} available)</span>`;
    }
    
    // Update add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => addToCart(product.name, product.price);
        if (product.stock === 0) {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Out of Stock';
        }
    }
}

// Helper function to get color codes (basic implementation)
function getColorCode(colorName) {
    const colorMap = {
        'White Pearl': '#ede8deff',
        'Soft Pink': '#ffabc7ff',
        'Soft Blue': '#a3cefbff',
        'Emerald': '#0d4426ff',
        'Gold': '#f5efcbff',
        'Rose Gold': '#e8b4a0',
        'Ivory': '#fff2d7ff',
        'chocolate brown': '#552f18ff',
        'Soft Blush Pink': '#e88ba7ff',
        'beige nude': '#e8d3b4ff',
        'Ivory': '#fff0ddff',
        'Taupe saude': '#f6f4c9ff',
        'Red glossy': '#191970',
        'ivory tweed': '#fffeedff'
    };
    
    return colorMap[colorName] || '#cccccc';
}

// Function to filter products by category
async function filterProductsByCategory(category) {
    await productManager.loadProducts();
    const products = category === 'all' ? productManager.getAllProducts() : productManager.getProductsByCategory(category);
    
    const container = document.querySelector('.product-grid');
    if (container) {
        const productsHTML = products.map(product => productManager.renderProductCard(product)).join('');
        container.innerHTML = productsHTML;
    }
}

// Function to search products
async function searchProducts(query) {
    await productManager.loadProducts();
    const products = productManager.searchProducts(query);
    
    const container = document.querySelector('.product-grid');
    if (container) {
        const productsHTML = products.map(product => productManager.renderProductCard(product)).join('');
        container.innerHTML = productsHTML;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductManager, productManager };
}
