const STORAGE_KEY = "rabtech_capstone_products";
const LOGIN_KEY = "rabtech_capstone_logged_in";

const defaultProducts = [
    {
        id: 1,
        name: "Accessibility Toolkit",
        category: "Software",
        price: 999,
        stock: 20
    },
    {
        id: 2,
        name: "Web Development Course",
        category: "Education",
        price: 1499,
        stock: 35
    },
    {
        id: 3,
        name: "Smart Dashboard",
        category: "Services",
        price: 2499,
        stock: 12
    }
];

let products = loadProducts();

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const loginMessage = document.getElementById("loginMessage");

const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");

const productTableBody = document.getElementById("productTableBody");
const productSearch = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");

const saveProductBtn = document.getElementById("saveProductBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

function loadProducts() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            return JSON.parse(saved);
        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultProducts)
        );

        return [...defaultProducts];

    } catch (error) {
        console.error(error);
        return [...defaultProducts];
    }
}

function saveProducts() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
    );
}

function showDashboard() {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    logoutBtn.hidden = false;

    renderProducts();
}

function showLogin() {
    loginSection.hidden = false;
    dashboardSection.hidden = true;
    logoutBtn.hidden = true;
}

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (
        email === "admin@rabtech.com" &&
        password === "admin123"
    ) {
        localStorage.setItem(LOGIN_KEY, "true");

        loginMessage.textContent = "";

        showDashboard();

    } else {

        loginMessage.textContent =
            "Invalid login. Demo: admin@rabtech.com / admin123";
    }
});

logoutBtn.addEventListener("click", function() {

    localStorage.removeItem(LOGIN_KEY);

    showLogin();
});


function renderProducts() {

    const searchTerm =
        productSearch.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value;

    let filtered = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    productTableBody.innerHTML = "";

    if (filtered.length === 0) {

        document.getElementById("emptyMessage").textContent =
            "No products found.";

    } else {

        document.getElementById("emptyMessage").textContent = "";

        filtered.forEach(product => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(product.name)}</td>
                <td>${escapeHTML(product.category)}</td>
                <td>₹${Number(product.price).toLocaleString("en-IN")}</td>
                <td>${product.stock}</td>
                <td>
                    <button
                        class="small-btn"
                        onclick="editProduct(${product.id})">
                        Edit
                    </button>

                    <button
                        class="small-btn delete-btn"
                        onclick="deleteProduct(${product.id})">
                        Delete
                    </button>
                </td>
            `;

            productTableBody.appendChild(row);
        });
    }

    updateStats();
}


productForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const id = productId.value;

    const productData = {
        name: productName.value.trim(),
        category: productCategory.value,
        price: Number(productPrice.value),
        stock: Number(productStock.value)
    };

    if (id) {

        const index =
            products.findIndex(
                product => product.id === Number(id)
            );

        if (index !== -1) {
            products[index] = {
                id: Number(id),
                ...productData
            };
        }

    } else {

        products.push({
            id: Date.now(),
            ...productData
        });
    }

    saveProducts();
    resetForm();
    renderProducts();
});


function editProduct(id) {

    const product =
        products.find(item => item.id === id);

    if (!product) return;

    productId.value = product.id;
    productName.value = product.name;
    productCategory.value = product.category;
    productPrice.value = product.price;
    productStock.value = product.stock;

    saveProductBtn.textContent = "Update Product";
    cancelEditBtn.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function deleteProduct(id) {

    const product =
        products.find(item => item.id === id);

    if (!product) return;

    const confirmed =
        confirm(`Delete "${product.name}"?`);

    if (!confirmed) return;

    products =
        products.filter(item => item.id !== id);

    saveProducts();

    renderProducts();
}


cancelEditBtn.addEventListener(
    "click",
    resetForm
);


function resetForm() {

    productForm.reset();

    productId.value = "";

    saveProductBtn.textContent = "Add Product";

    cancelEditBtn.hidden = true;
}


productSearch.addEventListener(
    "input",
    renderProducts
);

categoryFilter.addEventListener(
    "change",
    renderProducts
);


function updateStats() {

    document.getElementById("totalProducts")
        .textContent = products.length;

    const categories =
        new Set(products.map(product => product.category));

    document.getElementById("totalCategories")
        .textContent = categories.size;

    const totalStock =
        products.reduce(
            (sum, product) => sum + Number(product.stock),
            0
        );

    document.getElementById("totalStock")
        .textContent = totalStock;
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


if (
    localStorage.getItem(LOGIN_KEY) === "true"
) {
    showDashboard();
} else {
    showLogin();
}