const movies = [
    { id: 1, title: "Yüzüklerin Efendisi: Kralın Dönüşü", year: 2003, rating: 9.2, type: "film", duration: "3s 21dk", category: "populer", emoji: "💍" },
    { id: 2, title: "Breaking Bad", year: 2008, rating: 9.5, type: "dizi", duration: "5 Sezon", category: "populer", emoji: "🧪" },
    { id: 3, title: "Inception", year: 2010, rating: 8.8, type: "film", duration: "2s 28dk", category: "populer", emoji: "🌀" },
    { id: 4, title: "Game of Thrones", year: 2011, rating: 9.2, type: "dizi", duration: "8 Sezon", category: "populer", emoji: "🐉" },
    { id: 5, title: "The Dark Knight", year: 2008, rating: 9.0, type: "film", duration: "2s 32dk", category: "film", emoji: "🦇" },
    { id: 6, title: "Stranger Things", year: 2016, rating: 8.7, type: "dizi", duration: "4 Sezon", category: "dizi", emoji: "⚡" },
    { id: 7, title: "Interstellar", year: 2014, rating: 8.7, type: "film", duration: "2s 49dk", category: "film", emoji: "🌌" },
    { id: 8, title: "The Witcher", year: 2019, rating: 8.2, type: "dizi", duration: "3 Sezon", category: "dizi", emoji: "⚔️" },
    { id: 9, title: "Pulp Fiction", year: 1994, rating: 8.9, type: "film", duration: "2s 34dk", category: "film", emoji: "🔫" },
    { id: 10, title: "Squid Game", year: 2021, rating: 8.0, type: "dizi", duration: "1 Sezon", category: "dizi", emoji: "🟢" },
    { id: 11, title: "The Matrix", year: 1999, rating: 8.7, type: "film", duration: "2s 16dk", category: "film", emoji: "💊" },
    { id: 12, title: "Dark", year: 2017, rating: 8.7, type: "dizi", duration: "3 Sezon", category: "dizi", emoji: "🔮" },
    { id: 13, title: "Forrest Gump", year: 1994, rating: 8.8, type: "film", duration: "2s 22dk", category: "film", emoji: "🪶" },
    { id: 14, title: "The Office", year: 2005, rating: 8.9, type: "dizi", duration: "9 Sezon", category: "dizi", emoji: "📄" },
    { id: 15, title: "Fight Club", year: 1999, rating: 8.8, type: "film", duration: "2s 19dk", category: "film", emoji: "🧼" },
    { id: 16, title: "Sherlock", year: 2010, rating: 9.1, type: "dizi", duration: "4 Sezon", category: "dizi", emoji: "🔍" },
    { id: 17, title: "Gladiator", year: 2000, rating: 8.5, type: "film", duration: "2s 35dk", category: "film", emoji: "⚔️" },
    { id: 18, title: "Friends", year: 1994, rating: 8.9, type: "dizi", duration: "10 Sezon", category: "dizi", emoji: "🛋️" },
    { id: 19, title: "The Godfather", year: 1972, rating: 9.2, type: "film", duration: "2s 55dk", category: "film", emoji: "🍝" },
    { id: 20, title: "Band of Brothers", year: 2001, rating: 9.4, type: "dizi", duration: "1 Sezon", category: "dizi", emoji: "🎖️" }
];

let currentFilter = "all";
let currentSearch = "";

const movieGrid = document.getElementById("movieGrid");
const itemCount = document.getElementById("itemCount");
const sectionTitle = document.getElementById("sectionTitle");
const searchInput = document.getElementById("searchInput");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");

function renderMovies() {
    let filtered = movies;

    if (currentFilter !== "all") {
        filtered = filtered.filter(m => m.category === currentFilter || m.type === currentFilter);
    }

    if (currentSearch) {
        const q = currentSearch.toLowerCase();
        filtered = filtered.filter(m => m.title.toLowerCase().includes(q));
    }

    itemCount.textContent = `${filtered.length} içerik`;

    if (currentFilter !== "all") {
        const names = { all: "Tüm İçerikler", film: "Filmler", dizi: "Diziler", populer: "Popüler" };
        sectionTitle.textContent = names[currentFilter] || "Tüm İçerikler";
    } else {
        sectionTitle.textContent = currentSearch ? `"${currentSearch}" için sonuçlar` : "Tüm İçerikler";
    }

    movieGrid.innerHTML = filtered.map(m => `
        <div class="movie-card" data-id="${m.id}">
            <div class="poster">
                <span class="type-badge">${m.type === "film" ? "🎬 Film" : "📺 Dizi"}</span>
                ${m.emoji}
            </div>
            <div class="info">
                <h3>${m.title}</h3>
                <div class="meta">
                    <span>⭐ ${m.rating}</span>
                    <span>${m.duration}</span>
                    <span>${m.year}</span>
                </div>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".movie-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = parseInt(card.dataset.id);
            const movie = movies.find(m => m.id === id);
            if (movie) {
                heroTitle.textContent = movie.title;
                heroDesc.textContent = `${movie.emoji} ${movie.type === "film" ? "Film" : "Dizi"} | ${movie.duration} | ${movie.year}`;
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    });
}

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderMovies();
    });
});

searchInput.addEventListener("input", () => {
    currentSearch = searchInput.value;
    currentFilter = "all";
    document.querySelector(".filter-btn.active").classList.remove("active");
    document.querySelector('[data-filter="all"]').classList.add("active");
    renderMovies();
});

renderMovies();
