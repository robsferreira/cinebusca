// Localmente:
const API_URL = 'http://localhost:3000/buscar';

// Online:
const API_URL = 'https://seu-app-no-render.onrender.com/buscar';

// Centralizando todos os seletores em um único objeto 'el'
const el = {
    input: document.getElementById('userInput'),
    button: document.getElementById('searchBtn'),
    grid: document.getElementById('resultsGrid'),
    modal: document.getElementById('movieModal'),
    modalBody: document.getElementById('modalBody'),
    closeModal: document.querySelector('.close-btn')
};

/**
 * Interface e Modal
 */
function mostrarDetalhes(filme) {
    const { title, poster_path, vote_average, overview, release_date } = filme;
    
    el.modalBody.innerHTML = `
        <div class="modal-info-flex">
            <figure>
                <img src="${IMG_BASE}${poster_path}" alt="Capa do filme ${title}">
            </figure>
            <section>
                <h2>${title}</h2>
                <time datetime="${release_date}">
                    <strong>Lançamento:</strong> ${release_date ? release_date.split('-').reverse().join('/') : 'N/A'}
                </time>
                <p><strong>Avaliação:</strong> ⭐ ${vote_average.toFixed(1)}</p>
                <hr>
                <h3>Sinopse</h3>
                <p>${overview || 'Sinopse não disponível.'}</p>
            </section>
        </div>
    `;
    el.modal.showModal(); // Abre o dialog de forma semântica
}

const renderMessage = (msg) => {
    el.grid.innerHTML = `<p class="placeholder-text">${msg}</p>`;
};

const criarCardFilme = (filme) => {
    const { title, poster_path, vote_average, overview } = filme;
    const card = document.createElement('div');
    card.classList.add('movie-card');

    card.innerHTML = `
        <img src="${IMG_BASE}${poster_path}" alt="${title}" loading="lazy">
        <div class="movie-info">
            <h3>${title}</h3>
            <p>${overview ? overview.substring(0, 90) + '...' : 'Sem descrição.'}</p>
            <span class="nota">⭐ ${vote_average.toFixed(1)}</span>
        </div>
    `;

    // Conecta o clique ao modal
    card.addEventListener('click', () => mostrarDetalhes(filme));
    
    return card;
};

/**
 * Busca de Dados
 */
async function executarBusca() {
    const termo = el.input.value.trim();
    if (!termo) return;

    renderMessage("Buscando filmes...");

    try {
        const res = await fetch(`${API_URL}?query=${encodeURIComponent(termo)}`);
        const filmes = await res.json();

        el.grid.innerHTML = ''; 

        if (!filmes || filmes.length === 0) {
            renderMessage("Nenhum filme encontrado.");
            return;
        }

        filmes.forEach(f => el.grid.appendChild(criarCardFilme(f)));

    } catch (err) {
        console.error(err);
        renderMessage("Erro ao conectar com o servidor. Verifique se o Node.js está rodando.");
    }
}

/**
 * Eventos
 */
el.button.addEventListener('click', executarBusca);
el.input.addEventListener('keypress', (e) => e.key === 'Enter' && executarBusca());
el.closeModal.onclick = () => el.modal.close();

// Fechar ao clicar fora do conteúdo branco
el.modal.addEventListener('click', (e) => {
    if (e.target === el.modal) el.modal.close();
});
