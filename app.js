let movies = [];
let currentFilter = "all";

const movieGrid = document.getElementById("movieGrid");
const itemCount = document.getElementById("itemCount");
const sectionTitle = document.getElementById("sectionTitle");
const searchInput = document.getElementById("searchInput");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");

async function loadMovies() {
    try {
        const res = await fetch("/api/movies");
        movies = await res.json();
    } catch {
        try { const res = await fetch("movies.json"); movies = await res.json(); } catch { movies = []; }
    }
    if (movies.length > 0) {
        const hero = movies[Math.floor(Math.random() * movies.length)];
        heroTitle.textContent = hero.title;
        heroDesc.textContent = `${hero.overview ? hero.overview.substring(0, 120) + "..." : hero.emoji + " " + (hero.type === "film" ? "Film" : "Dizi")}`;
        document.querySelector(".hero-meta").innerHTML = `
            <span>⭐ ${hero.rating || "?"}</span>
            <span>🕒 ${hero.duration || "?"}</span>
            <span>${hero.year || "?"}</span>
        `;
    }
    renderMovies();
}

function renderMovies() {
    let filtered = movies;

    if (currentFilter !== "all") {
        filtered = filtered.filter(m => m.category === currentFilter || m.type === currentFilter);
    }

    itemCount.textContent = `${filtered.length} içerik`;

    if (currentFilter !== "all") {
        const names = { all: "Tüm İçerikler", film: "Filmler", dizi: "Diziler", populer: "Popüler" };
        sectionTitle.textContent = names[currentFilter] || "Tüm İçerikler";
    } else {
        sectionTitle.textContent = "Tüm İçerikler";
    }

    movieGrid.innerHTML = filtered.map(m => `
        <div class="movie-card" data-id="${m.id}">
            <div class="poster" ${m.poster ? `style="background:url('${m.poster}') center/cover no-repeat;"` : ""}>
                <span class="type-badge">${m.type === "film" ? "🎬 Film" : "📺 Dizi"}</span>
                ${!m.poster ? m.emoji : ""}
            </div>
            <div class="info">
                <h3>${m.title}</h3>
                <div class="meta">
                    <span>⭐ ${m.rating || "?"}</span>
                    <span>${m.duration || "?"}</span>
                    <span>${m.year || "?"}</span>
                </div>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".movie-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = parseInt(card.dataset.id);
            openModal(id);
        });
    });
}

function openModal(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    const existing = document.querySelector(".movie-modal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.className = "movie-modal";
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">✕</button>
            <div class="modal-layout">
                <div class="modal-poster" ${movie.poster ? `style="background:url('${movie.poster}') center/cover no-repeat;min-height:400px;"` : ""}>
                    ${!movie.poster ? `<div style="font-size:80px;display:flex;align-items:center;justify-content:center;min-height:400px;">${movie.emoji}</div>` : ""}
                </div>
                <div class="modal-info">
                    <span class="badge">${movie.type === "film" ? "🎬 Film" : "📺 Dizi"}</span>
                    <h2>${movie.title}</h2>
                    <p>${movie.overview || "Açıklama bulunamadı."}</p>
                    <div class="modal-meta">
                        <span>⭐ ${movie.rating || "?"}</span>
                        <span>📅 ${movie.year || "?"}</span>
                        <span>🕒 ${movie.duration || "?"}</span>
                    </div>
                    <iframe src="${movie.embed_url}" allowfullscreen frameborder="0" class="modal-iframe"></iframe>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add("active"), 10);

    modal.querySelector(".modal-close").addEventListener("click", () => closeModal(modal));
    modal.querySelector(".modal-overlay").addEventListener("click", () => closeModal(modal));
}

function closeModal(modal) {
    modal.classList.remove("active");
    setTimeout(() => modal.remove(), 300);
}

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderMovies();
    });
});

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const q = searchInput.value.trim();
        if (q) window.location.href = "arama.html?q=" + encodeURIComponent(q);
    }
});

loadMovies();
