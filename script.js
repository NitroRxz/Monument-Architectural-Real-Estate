/**
 * MONUMENT — Architectural Real Estate Engine
 * Handles properties state, dynamic rendering, filtering, detail modal, and contact validation.
 */

// 1. DATA MODEL (Fictional Architectural Properties)
const propertiesData = [
    {
        id: "1",
        title: "The Concrete Horizon Residence",
        location: "Zurich, Switzerland",
        locationKey: "zurich",
        type: "villa",
        typeLabel: "MODERN VILLA",
        price: 12500000,
        priceFormatted: "$12,500,000",
        bedrooms: 4,
        bathrooms: 5,
        area: "620 m²",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
        description: "Positioned along the lake shore, this residence features monolithic exposed concrete slabs paired with floor-to-ceiling triple-glazed glass panels. Engineered to maximize natural daylight while maintaining complete thermal privacy.",
        features: ["Structural Concrete Finish", "Geothermal Heating", "Private Lake Access", "Infiniti Edge Pool", "Minimalist Italian Joinery", "Subterranean 4-Car Garage"]
    },
    {
        id: "2",
        title: "Kyoto Forest Pavilion",
        location: "Kyoto, Japan",
        locationKey: "kyoto",
        type: "residence",
        typeLabel: "RESIDENCE",
        price: 8900000,
        priceFormatted: "$8,900,000",
        bedrooms: 3,
        bathrooms: 3,
        area: "410 m²",
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
        description: "A harmonious synthesis of charred cedar (Shou Sugi Ban) and structural steel embedded within a private bamboo grove. The structure elevated above ground level preserves the natural topography.",
        features: ["Charred Cedar Cladding", "Zen Water Courtyard", "Radiant Floor Heating", "Tatami Tea Pavilion", "Filtered Forest Views", "Solar Energy Storage"]
    },
    {
        id: "3",
        title: "Bel Air Monolith",
        location: "Los Angeles, USA",
        locationKey: "los-angeles",
        type: "villa",
        typeLabel: "LUXURY VILLA",
        price: 18200000,
        priceFormatted: "$18,200,000",
        bedrooms: 5,
        bathrooms: 6,
        area: "890 m²",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
        description: "Cantilevered over the canyon, the Bel Air Monolith presents dramatic linear sightlines extending toward the Pacific Ocean. Minimal interior walls emphasize raw scale and uninterrupted space.",
        features: ["Cantilevered Pool", "Custom Basalt Kitchen", "Wine Cellar & Tasting Room", "Smart Glass Privacy Control", "Private Security Gate", "Panoramas to Pacific"]
    },
    {
        id: "4",
        title: "Nordic Fjord Sanctuary",
        location: "Oslo, Norway",
        locationKey: "oslo",
        type: "residence",
        typeLabel: "RESIDENCE",
        price: 6400000,
        priceFormatted: "$6,400,000",
        bedrooms: 3,
        bathrooms: 3,
        area: "350 m²",
        image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
        description: "Designed for extreme climate efficiency, this residence combines local granite, treated pine, and high-performance insulation to deliver a net-zero carbon dwelling overlooking the fjord.",
        features: ["Triple Arctic Insulation", "Sauna & Ice Plunge", "Sedum Green Roof", "Custom Timber Millwork", "Private Boat Dock", "Net-Zero Energy Rating"]
    }
];

// 2. DOM ELEMENTS
const propertiesGrid = document.getElementById('properties-grid');
const propertiesCount = document.getElementById('properties-count');
const searchForm = document.getElementById('search-form');
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
const propertyModal = document.getElementById('property-modal');
const modalClose = document.getElementById('modal-close');
const modalContent = document.getElementById('modal-content');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const btnResetForm = document.getElementById('btn-reset-form');
const backToTopBtn = document.getElementById('back-to-top');

// 3. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    renderProperties(propertiesData);
    setupEventListeners();
});

// 4. PROPERTY RENDER ENGINE
function renderProperties(items) {
    if (!propertiesGrid) return;

    if (items.length === 0) {
        propertiesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 4rem 0; text-align: center; color: var(--text-muted);">
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No architectural properties match your selected criteria.</p>
                <p style="font-size: 0.85rem;">Try adjusting location, price range, or bedroom count.</p>
            </div>
        `;
        propertiesCount.textContent = "Showing 0 Properties";
        return;
    }

    propertiesCount.textContent = `Showing ${items.length} ${items.length === 1 ? 'Property' : 'Properties'}`;

    propertiesGrid.innerHTML = items.map(property => `
        <article class="property-card">
            <div class="property-card-image">
                <img src="${property.image}" alt="${property.title}" loading="lazy">
                <span class="property-card-tag">${property.typeLabel}</span>
            </div>
            <div class="property-card-body">
                <div class="property-card-header">
                    <h3 class="property-card-title">${property.title}</h3>
                    <span class="property-card-price">${property.priceFormatted}</span>
                </div>
                <div class="property-card-location">${property.location}</div>
                
                <div class="property-card-specs">
                    <div class="spec-item">
                        <span class="spec-label">BEDROOMS</span>
                        <span class="spec-value">${property.bedrooms}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">BATHROOMS</span>
                        <span class="spec-value">${property.bathrooms}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">AREA</span>
                        <span class="spec-value">${property.area}</span>
                    </div>
                </div>

                <div class="property-card-footer">
                    <button type="button" class="btn btn-outline btn-block view-detail-btn" data-id="${property.id}">
                        View Property
                    </button>
                </div>
            </div>
        </article>
    `).join('');

    // Attach event listeners to newly rendered 'View Property' buttons
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            openPropertyModal(id);
        });
    });
}

// 5. FILTERING LOGIC
function filterProperties(e) {
    if (e) e.preventDefault();

    const locVal = document.getElementById('filter-location').value;
    const typeVal = document.getElementById('filter-type').value;
    const priceVal = document.getElementById('filter-price').value;
    const bedVal = document.getElementById('filter-bedrooms').value;

    const filtered = propertiesData.filter(item => {
        // Location filter
        if (locVal !== 'all' && item.locationKey !== locVal) return false;
        
        // Type filter
        if (typeVal !== 'all' && item.type !== typeVal) return false;
        
        // Price filter
        if (priceVal !== 'all' && item.price > parseInt(priceVal)) return false;
        
        // Bedroom filter
        if (bedVal !== 'all' && item.bedrooms < parseInt(bedVal)) return false;

        return true;
    });

    renderProperties(filtered);
}

// 6. MODAL INTERACTION
function openPropertyModal(id) {
    const property = propertiesData.find(item => item.id === id);
    if (!property) return;

    modalContent.innerHTML = `
        <div class="modal-detail-grid">
            <div class="modal-detail-image">
                <img src="${property.image}" alt="${property.title}">
            </div>
            <div class="modal-detail-info">
                <span class="section-tag">${property.typeLabel}</span>
                <h2 class="modal-detail-title">${property.title}</h2>
                <div class="modal-detail-location">${property.location}</div>
                <div class="modal-detail-price">${property.priceFormatted}</div>
                
                <p class="modal-detail-desc">${property.description}</p>
                
                <div class="modal-features-list">
                    ${property.features.map(feat => `<div class="modal-feature-item">${feat}</div>`).join('')}
                </div>

                <div style="margin-top: auto;">
                    <a href="#contact" class="btn btn-solid btn-block modal-enquire-btn">Initiate Private Enquiry</a>
                </div>
            </div>
        </div>
    `;

    propertyModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scroll

    // Close modal when clicking enquiry button inside modal
    const enquireBtn = modalContent.querySelector('.modal-enquire-btn');
    if (enquireBtn) {
        enquireBtn.addEventListener('click', () => {
            closePropertyModal();
            // Pre-select property in form
            const formProp = document.getElementById('form-property');
            if (formProp) formProp.value = property.id;
        });
    }
}

function closePropertyModal() {
    propertyModal.classList.remove('active');
    document.body.style.overflow = '';
}

// 7. FORM VALIDATION
function validateAndSubmitForm(e) {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const msgInput = document.getElementById('form-message');

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
        showError(nameInput, 'err-name');
        isValid = false;
    } else {
        clearError(nameInput, 'err-name');
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        showError(emailInput, 'err-email');
        isValid = false;
    } else {
        clearError(emailInput, 'err-email');
    }

    // Validate Message
    if (!msgInput.value.trim()) {
        showError(msgInput, 'err-message');
        isValid = false;
    } else {
        clearError(msgInput, 'err-message');
    }

    if (isValid) {
        contactForm.classList.add('hidden');
        formSuccess.classList.add('active');
        contactForm.reset();
    }
}

function showError(inputEl, errorId) {
    const parent = inputEl.parentElement;
    parent.classList.add('error');
}

function clearError(inputEl, errorId) {
    const parent = inputEl.parentElement;
    parent.classList.remove('error');
}

// 8. EVENT LISTENERS SETUP
function setupEventListeners() {
    // Filter submit
    if (searchForm) {
        searchForm.addEventListener('submit', filterProperties);
    }

    // Mobile nav toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Modal close button & backdrop click
    if (modalClose) {
        modalClose.addEventListener('click', closePropertyModal);
    }

    if (propertyModal) {
        propertyModal.addEventListener('click', (e) => {
            if (e.target === propertyModal) {
                closePropertyModal();
            }
        });
    }

    // Contact form validation
    if (contactForm) {
        contactForm.addEventListener('submit', validateAndSubmitForm);
    }

    // Reset form success state
    if (btnResetForm) {
        btnResetForm.addEventListener('click', () => {
            formSuccess.classList.remove('active');
            contactForm.classList.remove('hidden');
        });
    }

    // Back to top smooth scroll
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && propertyModal.classList.contains('active')) {
            closePropertyModal();
        }
    });
}