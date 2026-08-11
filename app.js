/* ==========================================================================
   RICO MILLO OFFICIAL WEB DEMO - INTERACTIVE JAVASCRIPT
   Focus: Physical Store Locator & B2B Distributor Recruitment
   ========================================================================== */

// Store Locator Data (Real Outlets & Supermarkets in Panama with Geo-Coordinates)
const STORES_DATA = [
    {
        id: 1,
        name: "Foodie Market - Punta Pacífica",
        province: "panama",
        city: "Punta Pacífica, Panamá Centro",
        address: "Plaza Foodie, Av. Punta Pacífica",
        type: "Tienda Gourmet & Market",
        phone: "+507 6720-5752",
        lat: 8.9774,
        lng: -79.5052
    },
    {
        id: 2,
        name: "Super Carnes - Costa Verde",
        province: "oeste",
        city: "Costa Verde, Panamá Oeste",
        address: "Plaza Costa Verde, Autopista Arraiján - La Chorrera",
        type: "Supermercado (Exhibidor Completo)",
        phone: "+507 6720-5752",
        lat: 8.8821,
        lng: -79.7423
    },
    {
        id: 3,
        name: "Abarrotería & Kiosco El Carmelo",
        province: "oeste",
        city: "La Chorrera, Panamá Oeste",
        address: "Av. Central, La Chorrera (Cerca de La Arena)",
        type: "Kiosco / Tienda de Barrio",
        phone: "+507 6720-5752",
        lat: 8.8803,
        lng: -79.7831
    },
    {
        id: 4,
        name: "Supermercados Rey - Calle 50",
        province: "panama",
        city: "San Francisco, Panamá Centro",
        address: "Vía Porras y Calle 50",
        type: "Supermercado Cadena",
        phone: "+507 270-5555",
        lat: 8.9862,
        lng: -79.5135
    },
    {
        id: 5,
        name: "Supermercado Xtra - Arraiján Town Center",
        province: "oeste",
        city: "Arraiján, Panamá Oeste",
        address: "Vía Interamericana",
        type: "Supermercado",
        phone: "+507 300-1111",
        lat: 8.9248,
        lng: -79.6582
    },
    {
        id: 6,
        name: "Distribuidora Central Chiriquí",
        province: "chiriqui",
        city: "David, Chiriquí",
        address: "Calle 4ta Este, David",
        type: "Distribuidor Mayorista",
        phone: "+507 775-9900",
        lat: 8.4273,
        lng: -82.4309
    }
];

let leafletMap = null;
let mapMarkers = [];

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    renderStores(STORES_DATA);
    initRealPanamaMap();
    updateCalculator();
    setupMobileMenu();
    setupNavbarScroll();
    initHeroCarousel();
});

// Hero Carousel Slider Logic
let currentHeroSlide = 0;
let heroSlideTimer = null;

function initHeroCarousel() {
    resetHeroTimer();
}

function setHeroSlide(index) {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".carousel-dots .dot");
    
    if (slides.length === 0) return;
    
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    
    currentHeroSlide = (index + slides.length) % slides.length;
    
    slides[currentHeroSlide]?.classList.add("active");
    dots[currentHeroSlide]?.classList.add("active");
    
    resetHeroTimer();
}

function nextHeroSlide() {
    setHeroSlide(currentHeroSlide + 1);
}

function prevHeroSlide() {
    setHeroSlide(currentHeroSlide - 1);
}

function resetHeroTimer() {
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(() => {
        nextHeroSlide();
    }, 4000);
}

// Initialize Real Interactive Leaflet Map of Panama
function initRealPanamaMap() {
    const mapElement = document.getElementById("realPanamaMap");
    if (!mapElement || typeof L === "undefined") return;

    // Center map on Panama (Lat: 8.98, Lng: -79.51)
    leafletMap = L.map("realPanamaMap", {
        center: [8.95, -79.60],
        zoom: 10,
        zoomControl: true
    });

    // Dark Map Style Tiles (CartoDB Dark Matter / Positron)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
        subdomains: 'abcd'
    }).addTo(leafletMap);

    // Render Markers with Rico Millo Logo Icon
    addLogoMarkersToMap(STORES_DATA);
}

// Add Custom Rico Millo Logo Markers to Leaflet Map
function addLogoMarkersToMap(stores) {
    if (!leafletMap || typeof L === "undefined") return;

    // Clear existing markers
    mapMarkers.forEach(marker => leafletMap.removeLayer(marker));
    mapMarkers = [];

    // Custom Icon HTML containing Rico Millo Logo
    const createLogoIcon = () => L.divIcon({
        className: "custom-leaflet-logo-pin",
        html: `
            <div class="leaflet-logo-marker-wrapper">
                <div class="leaflet-pin-ring">
                    <img src="assets/logo.webp" alt="Rico Millo Logo">
                </div>
                <div class="leaflet-pin-tip"></div>
            </div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 52],
        popupAnchor: [0, -48]
    });

    stores.forEach(store => {
        if (!store.lat || !store.lng) return;

        const marker = L.marker([store.lat, store.lng], { icon: createLogoIcon() })
            .addTo(leafletMap);

        const popupContent = `
            <div class="map-popup-card">
                <div class="popup-header">
                    <img src="assets/logo.webp" class="popup-logo" alt="Rico Millo">
                    <div>
                        <strong>${escapeHtml(store.name)}</strong>
                        <small>${escapeHtml(store.type)}</small>
                    </div>
                </div>
                <p class="popup-address"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(store.address)}</p>
                <a href="https://www.google.com/maps/search/${encodeURIComponent(store.name + ' ' + store.address)}" target="_blank" class="popup-btn">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir en Google Maps
                </a>
            </div>
        `;

        marker.bindPopup(popupContent, { className: 'custom-leaflet-popup' });
        mapMarkers.push(marker);
    });
}

// Render Store List
function renderStores(stores) {
    const listContainer = document.getElementById("storesList");
    const countContainer = document.getElementById("storesCount");
    
    if (!listContainer) return;
    
    if (stores.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #64748B;">
                <i class="fa-solid fa-store-slash" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                No encontramos tiendas que coincidan con tu búsqueda.
            </div>
        `;
        if (countContainer) countContainer.innerText = "0 tiendas encontradas";
        return;
    }
    
    if (countContainer) {
        countContainer.innerText = `Mostrando ${stores.length} tienda(s) física(s) verificada(s)`;
    }
    
    listContainer.innerHTML = stores.map(store => `
        <div class="store-card" onclick="focusStoreOnMap(${store.id})">
            <div class="store-icon"><i class="fa-solid fa-store"></i></div>
            <div class="store-details">
                <div class="store-name">${escapeHtml(store.name)}</div>
                <div class="store-address">${escapeHtml(store.address)}</div>
                <span class="store-city">${escapeHtml(store.city)} • ${escapeHtml(store.type)}</span>
            </div>
            <a href="https://www.google.com/maps/search/${encodeURIComponent(store.name + ' ' + store.address)}" target="_blank" class="btn btn-outline-red btn-sm" title="Ver en Google Maps" onclick="event.stopPropagation()">
                <i class="fa-solid fa-location-arrow"></i> Ir
            </a>
        </div>
    `).join("");
}

// Focus store on Leaflet map when clicked in store list
function focusStoreOnMap(storeId) {
    const store = STORES_DATA.find(s => s.id === storeId);
    if (!store || !leafletMap) return;

    leafletMap.flyTo([store.lat, store.lng], 14, { duration: 1.2 });
    
    const targetMarker = mapMarkers.find((m, index) => STORES_DATA[index]?.id === storeId);
    if (targetMarker) {
        targetMarker.openPopup();
    }
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
    addLogoMarkersToMap(filtered);
    
    if (filtered.length > 0 && leafletMap) {
        const bounds = L.latLngBounds(filtered.map(s => [s.lat, s.lng]));
        leafletMap.fitBounds(bounds, { padding: [50, 50] });
    }
}

// Distributor Profit Calculator for Store Owners
function updateCalculator() {
    const cajasInput = document.getElementById("cajasCount");
    const cajasValLabel = document.getElementById("cajasVal");
    const calcInversion = document.getElementById("calcInversion");
    const calcGanancia = document.getElementById("calcGanancia");
    
    if (!cajasInput) return;
    
    const numCajasSemana = parseInt(cajasInput.value, 10) || 5;
    const precioCajaCosto = 12.00; // Costo por caja de 24 unidades ($0.50 c/u)
    const precioVentaPublico = 24.00; // Venta a $1.00 la unidad ($24.00 total)
    
    const inversionSemanal = numCajasSemana * precioCajaCosto;
    const ventaSemanal = numCajasSemana * precioVentaPublico;
    const gananciaSemanal = ventaSemanal - inversionSemanal;
    
    const gananciaMensual = gananciaSemanal * 4;
    
    if (cajasValLabel) cajasValLabel.innerText = `${numCajasSemana} caja(s) / sem`;
    if (calcInversion) calcInversion.innerText = `$${inversionSemanal.toFixed(2)}`;
    if (calcGanancia) calcGanancia.innerText = `$${gananciaMensual.toFixed(2)}`;
}

// Handle Store Owner WhatsApp Lead Submission (wa.link/wm6d7h)
function handleWholesaleSubmit(event) {
    event.preventDefault();
    
    const businessName = document.getElementById("businessName")?.value || "";
    const contactName = document.getElementById("contactName")?.value || "";
    const contactPhone = document.getElementById("contactPhone")?.value || "";
    const businessType = document.getElementById("businessType")?.value || "";
    const businessLocation = document.getElementById("businessLocation")?.value || "";
    const businessMessage = document.getElementById("businessMessage")?.value || "";
    
    const text = `¡Hola Productos SK / Rico Millo! 🍿
Quiero solicitar información para colocar el exhibidor oficial de Rico Millo $1.00 en mi local comercial.

📌 *Datos de mi Negocio:*
• *Nombre del Comercio:* ${businessName}
• *Contacto:* ${contactName}
• *Teléfono / WhatsApp:* ${contactPhone}
• *Tipo de Comercio:* ${businessType}
• *Ubicación / Ciudad:* ${businessLocation}

💬 *Solicitud:* ${businessMessage || 'Deseo coordinar la instalación del exhibidor rojo y realizar mi primer pedido mayorista.'}`;

    const whatsappUrl = `https://wa.me/50767205752?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
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
