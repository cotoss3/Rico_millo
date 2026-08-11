/* ==========================================================================
   RICO MILLO OFFICIAL WEB DEMO - INTERACTIVE JAVASCRIPT
   ========================================================================== */

// Sample Store Locator Data (Panama Verified Outlets)
const STORES_DATA = [
    {
        id: 1,
        name: "Foodie Market - Punta Pacífica",
        province: "panama",
        city: "Punta Pacífica, Panamá Centro",
        address: "Plaza Foodie, Av. Punta Pacífica",
        type: "Tienda Gourmet & Market",
        phone: "+507 6720-5752"
    },
    {
        id: 2,
        name: "Super Carnes - Costa Verde",
        province: "oeste",
        city: "Costa Verde, Panamá Oeste",
        address: "Plaza Costa Verde, Autopista Arraiján - La Chorrera",
        type: "Supermercado (Exhibidor Completo)",
        phone: "+507 6720-5752"
    },
    {
        id: 3,
        name: "Abarrotería & Kiosco El Carmelo",
        province: "oeste",
        city: "La Chorrera, Panamá Oeste",
        address: "Av. Central, La Chorrera (Cerca de La Arena)",
        type: "Kiosco / Tienda",
        phone: "+507 6720-5752"
    },
    {
        id: 4,
        name: "Supermercados Rey - Calle 50",
        province: "panama",
        city: "San Francisco, Panamá Centro",
        address: "Vía Porras y Calle 50",
        type: "Supermercado Cadena",
        phone: "+507 270-5555"
    },
    {
        id: 5,
        name: "Supermercado Xtra - Arraiján Town Center",
        province: "oeste",
        city: "Arraiján, Panamá Oeste",
        address: "Vía Interamericana",
        type: "Supermercado",
        phone: "+507 300-1111"
    },
    {
        id: 6,
        name: "Distribuidora Central Chiriquí",
        province: "chiriqui",
        city: "David, Chiriquí",
        address: "Calle 4ta Este",
        type: "Distribuidor Mayorista",
        phone: "+507 775-9900"
    }
];

let selectedOrderProduct = "";

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    renderStores(STORES_DATA);
    updateCalculator();
    setupProductFilter();
    setupMobileMenu();
    setupNavbarScroll();
});

// Render Store List
function renderStores(stores) {
    const listContainer = document.getElementById("storesList");
    const countContainer = document.getElementById("storesCount");
    
    if (!listContainer) return;
    
    if (stores.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #64748B;">
                <i class="fa-solid fa-store-slash" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                No encontramos puntos de venta que coincidan con tu búsqueda.
            </div>
        `;
        if (countContainer) countContainer.innerText = "0 puntos encontrados";
        return;
    }
    
    if (countContainer) {
        countContainer.innerText = `Mostrando ${stores.length} punto(s) de venta verificado(s)`;
    }
    
    listContainer.innerHTML = stores.map(store => `
        <div class="store-card">
            <div class="store-icon"><i class="fa-solid fa-store"></i></div>
            <div class="store-details">
                <div class="store-name">${escapeHtml(store.name)}</div>
                <div class="store-address">${escapeHtml(store.address)}</div>
                <span class="store-city">${escapeHtml(store.city)} • ${escapeHtml(store.type)}</span>
            </div>
            <a href="https://www.google.com/maps/search/${encodeURIComponent(store.name + ' ' + store.address)}" target="_blank" class="btn btn-outline-red btn-sm" title="Ver en Google Maps">
                <i class="fa-solid fa-location-arrow"></i> Ir
            </a>
        </div>
    `).join("");
}

// Filter Stores Logic
function filterStores() {
    const query = document.getElementById("storeSearchInput")?.value.toLowerCase().trim() || "";
    const selectedProvince = document.getElementById("provinceSelect")?.value || "all";
    
    const filtered = STORES_DATA.filter(store => {
        const matchesQuery = store.name.toLowerCase().includes(query) || 
                             store.address.toLowerCase().includes(query) ||
                             store.city.toLowerCase().includes(query);
                             
        const matchesProvince = selectedProvince === "all" || store.province === selectedProvince;
        
        return matchesQuery && matchesProvince;
    });
    
    renderStores(filtered);
}

// Distributor Profit Calculator
function updateCalculator() {
    const cajasInput = document.getElementById("cajasCount");
    const cajasValLabel = document.getElementById("cajasVal");
    const calcInversion = document.getElementById("calcInversion");
    const calcGanancia = document.getElementById("calcGanancia");
    
    if (!cajasInput) return;
    
    const numCajasSemana = parseInt(cajasInput.value, 10) || 5;
    const precioCajaCosto = 12.00; // Costo estimado de caja de 24 unidades ($0.50/u)
    const precioVentaPublico = 24.00; // Venta a $1.00 por unidad ($1.00 x 24 = $24.00)
    
    const inversionSemanal = numCajasSemana * precioCajaCosto;
    const ventaSemanal = numCajasSemana * precioVentaPublico;
    const gananciaSemanal = ventaSemanal - inversionSemanal;
    
    const gananciaMensual = gananciaSemanal * 4;
    
    if (cajasValLabel) cajasValLabel.innerText = `${numCajasSemana} caja(s) / sem`;
    if (calcInversion) calcInversion.innerText = `$${inversionSemanal.toFixed(2)}`;
    if (calcGanancia) calcGanancia.innerText = `$${gananciaMensual.toFixed(2)}`;
}

// Handle Wholesale Form Submission -> Redirect to WhatsApp wa.link/wm6d7h
function handleWholesaleSubmit(event) {
    event.preventDefault();
    
    const businessName = document.getElementById("businessName")?.value || "";
    const contactName = document.getElementById("contactName")?.value || "";
    const contactPhone = document.getElementById("contactPhone")?.value || "";
    const businessType = document.getElementById("businessType")?.value || "";
    const businessLocation = document.getElementById("businessLocation")?.value || "";
    const businessMessage = document.getElementById("businessMessage")?.value || "";
    
    const text = `¡Hola Rico Millo! 🌽
Quiero solicitar información para vender Rico Millo en mi negocio.

📌 *Datos de mi Negocio:*
• *Nombre:* ${businessName}
• *Contacto:* ${contactName}
• *Teléfono:* ${contactPhone}
• *Tipo:* ${businessType}
• *Ubicación:* ${businessLocation}

💬 *Mensaje:* ${businessMessage || 'Me interesa recibir lista de precios mayoristas y condiciones de entrega.'}`;

    const whatsappUrl = `https://wa.me/50767205752?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
}

// Product Category Filter
function setupProductFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");
    
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filter = btn.getAttribute("data-filter");
            
            productCards.forEach(card => {
                if (filter === "all" || card.getAttribute("data-category") === filter) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}

// Order Modal Functions
function openOrderModal(productName) {
    selectedOrderProduct = productName;
    const productNameEl = document.getElementById("modalProductName");
    const modal = document.getElementById("orderModal");
    
    if (productNameEl) productNameEl.innerText = `Producto: ${productName}`;
    if (modal) modal.classList.add("active");
}

function closeOrderModal() {
    const modal = document.getElementById("orderModal");
    if (modal) modal.classList.remove("active");
}

function sendOrderToWhatsApp() {
    const qty = document.getElementById("modalQty")?.value || "1 a 5 paquetes";
    const location = document.getElementById("modalLocation")?.value || "Ciudad de Panamá";
    
    const text = `¡Hola Rico Millo! 🍿
Quiero hacer una consulta sobre *${selectedOrderProduct}*.

• *Cantidad solicitada:* ${qty}
• *Ubicación de entrega:* ${location}

¿Me pueden brindar disponibilidad y método de compra? ¡Gracias!`;

    const whatsappUrl = `https://wa.me/50767205752?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
    closeOrderModal();
}

// Pitch Sales Modal
function openPitchModal() {
    const modal = document.getElementById("pitchModal");
    if (modal) modal.classList.add("active");
}

function closePitchModal() {
    const modal = document.getElementById("pitchModal");
    if (modal) modal.classList.remove("active");
}

function togglePitchBar() {
    const pitchBar = document.getElementById("pitchBar");
    if (pitchBar) {
        pitchBar.style.display = pitchBar.style.display === "none" ? "block" : "none";
    }
}

// Spotify Play Simulation
function togglePlaySim(btn) {
    const icon = btn.querySelector("i");
    if (icon) {
        if (icon.classList.contains("fa-play")) {
            icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");
        } else {
            icon.classList.remove("fa-pause");
            icon.classList.add("fa-play");
        }
    }
}

// Mobile Navbar Toggle
function setupMobileMenu() {
    const toggle = document.getElementById("mobileToggle");
    const menu = document.getElementById("navMenu");
    
    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }
}

// Navbar Shadow on Scroll
function setupNavbarScroll() {
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
    });
}

// Helper: Escape HTML
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
