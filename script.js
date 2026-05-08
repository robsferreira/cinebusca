const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const API_URL = '/buscar'; // URL relativa para funcionar no Render

const el = {
    input: document.getElementById('userInput'),
    button: document.getElementById('searchBtn'),
    grid: document.getElementById('resultsGrid'),
    modal: document.getElementById('movieModal'),
    modalBody: document.getElementById('modalBody'),
    closeModal: document.querySelector('.close-btn')
};

function mostrarDetalhes(filme) {
    const { title, poster_path, vote_average, overview, release_date } = filme;
    
    el.modalBody.innerHTML = `
        <div class="modal-info-flex">
            <figure>
                <img src="${IMG_BASE}${poster_path}" alt="Capa de ${title}">
            </figure>
            <section>
                <h2>${title}</h2>
                <time><strong>Lançamento:</strong> ${release_date ? release_date.split('-').reverse().join('/') : 'N/A'}</time>
                <p><strong>Avaliação:</strong> ⭐ ${vote_average.toFixed(1)}</p>
                <hr>
                <h3>Sinopse</h3>
                <p>${overview}</p>
            </section>
        </div>
    `;
    el.modal.showModal();
}

const criarCardFilme = (filme) => {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
        <img src="${IMG_BASE}${filme.poster_path}" alt="${filme.title}" loading="lazy">
        <div class="movie-info">
            <h3>${filme.title}</h3>
            <span class="nota">⭐ ${filme.vote_average.toFixed(1)}</span>
        </div>
    `;
    card.addEventListener('click', () => mostrarDetalhes(filme));
    return card;
};

async function executarBusca() {
    const termo = el.input.value.trim();
    if (!termo) return;

    el.grid.innerHTML = '<p class="placeholder-text">Buscando...</p>';

    try {
        const res = await fetch(`${API_URL}?query=${encodeURIComponent(termo)}`);
        const filmes = await res.json();
        el.grid.innerHTML = '';

        if (filmes.length === 0) {
            el.grid.innerHTML = '<p class="placeholder-text">Nenhum filme encontrado.</p>';
            return;
        }

        filmes.forEach(f => el.grid.appendChild(criarCardFilme(f)));
    } catch (err) {
        el.grid.innerHTML = '<p class="placeholder-text">Erro ao conectar com o servidor.</p>';
    }
}

el.button.addEventListener('click', executarBusca);
el.input.addEventListener('keypress', (e) => e.key === 'Enter' && executarBusca());
el.closeModal.onclick = () => el.modal.close();
el.modal.addEventListener('click', (e) => e.target === el.modal && el.modal.close());
