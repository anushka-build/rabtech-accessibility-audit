import { fetchUsers } from "./api.js";

const CACHE_KEY = "rabtech_users_cache";
const CACHE_TIME_KEY = "rabtech_users_cache_time";
const CACHE_DURATION = 10 * 60 * 1000;

let users = [];
let currentRole = "All";
let currentSort = "name-asc";

const tableBody = document.getElementById("userTableBody");
const searchInput = document.getElementById("userSearch");
const roleButtons = document.querySelectorAll("[data-role]");
const sortSelect = document.getElementById("userSort");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");


function showLoading() {
    if (loadingMessage) {
        loadingMessage.hidden = false;
    }

    if (errorMessage) {
        errorMessage.hidden = true;
    }

    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="3">Loading users...</td>
            </tr>
        `;
    }
}


function hideLoading() {
    if (loadingMessage) {
        loadingMessage.hidden = true;
    }
}


function showError(message) {
    hideLoading();

    if (errorMessage) {
        errorMessage.hidden = false;
        errorMessage.textContent = message;
    }
}


function getCachedUsers() {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

        if (!cachedData || !cachedTime) {
            return null;
        }

        const age = Date.now() - Number(cachedTime);

        if (age > CACHE_DURATION) {
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_TIME_KEY);
            return null;
        }

        return JSON.parse(cachedData);

    } catch (error) {
        console.error("Cache error:", error);
        return null;
    }
}


function saveUsersToCache(data) {
    localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(data)
    );

    localStorage.setItem(
        CACHE_TIME_KEY,
        Date.now().toString()
    );
}


async function loadUsers() {
    showLoading();

    try {
        const cachedUsers = getCachedUsers();

        if (cachedUsers) {
            users = cachedUsers;
        } else {
            users = await fetchUsers();
            saveUsersToCache(users);
        }

        renderUsers();
        hideLoading();

    } catch (error) {
        console.error(error);

        showError(
            "Sorry, user data could not be loaded. Please try again."
        );
    }
}


function renderUsers() {

    if (!tableBody) {
        return;
    }

    let result = [...users];

    const searchTerm = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";


    // Role filter
    if (currentRole !== "All") {
        result = result.filter(
            user => user.role === currentRole
        );
    }


    // Search filter
    if (searchTerm) {
        result = result.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }


    // Sorting
    result.sort((a, b) => {

        if (currentSort === "name-asc") {
            return a.name.localeCompare(b.name);
        }

        if (currentSort === "name-desc") {
            return b.name.localeCompare(a.name);
        }

        if (currentSort === "email-asc") {
            return a.email.localeCompare(b.email);
        }

        return 0;
    });


    // No result
    if (result.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="3">No users found.</td>
            </tr>
        `;

        return;
    }


    // Display users
    tableBody.innerHTML = result.map(user => `
        <tr>
            <td>${escapeHTML(user.name)}</td>
            <td>${escapeHTML(user.email)}</td>
            <td>${escapeHTML(user.role)}</td>
        </tr>
    `).join("");
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// Search
if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderUsers
    );
}


// Sorting
if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        event => {

            currentSort = event.target.value;

            renderUsers();
        }
    );
}


// Role buttons
roleButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            currentRole = button.dataset.role;

            roleButtons.forEach(btn => {
                btn.setAttribute(
                    "aria-pressed",
                    "false"
                );
            });

            button.setAttribute(
                "aria-pressed",
                "true"
            );

            renderUsers();
        }
    );
});


// Start application
loadUsers();