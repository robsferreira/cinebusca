const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// IMPORTANTE: Serve os arquivos estáticos (HTML, CSS, JS) da pasta atual
app.use(express.static('./'));

/**
 * ROTA DE BUSCA
 */
app.get('/buscar', async (req, res) => {
    const { query } = req.query;
    const apiKey = process.env.TMDB_API_KEY;

    if (!query) {
        return res.status(400).json({ error: "O termo de busca é obrigatório" });
    }

    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        // Filtra filmes com imagem e descrição para manter a qualidade
        const filmesFiltrados = data.results.filter(f => f.poster_path && f.overview);

        res.json(filmesFiltrados);
    } catch (error) {
        res.status(500).json({ error: "Erro ao consultar a API" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
