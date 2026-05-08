const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_URL = 'https://api.themoviedb.org/3/search/movie';

// Middlewares
app.use(cors());
app.use(express.json());

/**
 * DOCUMENTAÇÃO: Rota de busca
 * Centraliza a lógica de comunicação com o TMDB
 */
app.get('/buscar', async (req, res) => {
    const { query } = req.query; // Destruturação para código mais limpo
    const apiKey = process.env.TMDB_API_KEY;

    if (!query) {
        return res.status(400).json({ message: "Termo de busca vazio." });
    }

    try {
        const response = await fetch(`${TMDB_URL}?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`);
        
        if (!response.ok) throw new Error('Falha na API externa');

        const data = await response.json();

        // Inteligência: Removemos resultados irrelevantes (sem capa ou sem descrição)
        const resultadosLimpos = data.results.filter(f => f.poster_path && f.overview);

        res.json(resultadosLimpos);
    } catch (error) {
        console.error("❌ Erro no servidor:", error.message);
        res.status(500).json({ error: "Erro interno ao buscar filmes." });
    }
});

app.listen(PORT, () => console.log(`🚀 CineBusca Online: http://localhost:${PORT}`));