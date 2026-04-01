document.addEventListener('DOMContentLoaded', async () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mainNav = document.getElementById('main-nav');

    mobileToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(255, 255, 255, 0.95)';
        navLinks.style.padding = '20px';
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        } else {
            mainNav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        document.getElementById('site-logo').textContent = data.config.name;
        document.getElementById('hero-title').textContent = data.config.name;
        document.getElementById('hero-subtitle').textContent = `${data.config.location} | ${data.config.address}`;
        
        document.getElementById('footer-name').textContent = data.config.name;
        document.getElementById('footer-address').textContent = data.config.address;
        document.getElementById('footer-phone').textContent = data.config.contacts.phone;
        document.getElementById('footer-email').textContent = data.config.contacts.email;
        document.getElementById('current-year').textContent = new Date().getFullYear();

        const amenitiesGrid = document.getElementById('amenities-grid');
        data.amenities_global.forEach(amenity => {
            const div = document.createElement('div');
            div.className = 'amenity-card';
            div.innerHTML = `<i class="fa-solid ${amenity.icon}"></i><h3>${amenity.label}</h3>`;
            amenitiesGrid.appendChild(div);
        });

        const roomsGrid = document.getElementById('rooms-grid');
        data.units.forEach(unit => {
            if (!unit.active) return;
            const featuresHtml = unit.features.map(f => `<li>${f}</li>`).join('');
            const div = document.createElement('div');
            div.className = 'room-card';
            div.innerHTML = `
                <div class="room-img" style="background-image: url('img/${unit.gallery[0]}')">
                    <div class="room-price">od ${unit.price_off} Kč / noc</div>
                </div>
                <div class="room-content">
                    <h3>${unit.title}</h3>
                    <p><strong>Kapacita:</strong> ${unit.capacity} osob</p>
                    <p>${unit.short_desc}</p>
                    <ul class="room-features">${featuresHtml}</ul>
                    <p class="room-desc">${unit.long_desc}</p>
                </div>
            `;
            roomsGrid.appendChild(div);
        });

        const poiList = document.getElementById('poi-items');
        data.poi.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.name}</span><span class="poi-dist">${item.dist}</span>`;
            poiList.appendChild(li);
        });

        const bookingContainer = document.getElementById('booking-links-container');
        bookingContainer.innerHTML = `
            <a href="${data.config.external_links.booking}" target="_blank" class="btn-primary">Rezervovat na Booking.com</a>
            <a href="${data.config.external_links.echalupy}" target="_blank" class="btn-secondary">Zobrazit na e-chalupy.cz</a>
        `;

        if (typeof L !== 'undefined') {
            const map = L.map('map-container').setView([data.config.gps.lat, data.config.gps.lng], data.config.gps.zoom);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            L.marker([data.config.gps.lat, data.config.gps.lng])
                .addTo(map)
                .bindPopup(`<b>${data.config.name}</b><br>${data.config.address}`)
                .openPopup();
        }

    } catch (error) {
        document.getElementById('hero-subtitle').textContent = "Chyba při načítání dat. Zkontrolujte připojení.";
    }
});
