import api from './axios';

//Obtener todos los decks del usuario
export const getMyDecks = async () => {
    const response = await api.get('/decks');
    return response.data;
};

//Obtener un deck especifico con sus cartas
export const getDeckById = async (deckId) => {
    const response = await api.get(`/decks/${deckId}`);
    return response.data;
};

//Crear un nuevo deck
export const createDeck = async (deckData) => {
    // deckData = {title, description, is_public}
    const response = await api.post('/decks', deckData);
    return response.data;
};

//Actualizar un deck
export const updateDeck = async (deckId, deckData) => {
    const response = await api.put(`/decks/${deckId}`, deckData);
    return response.data;
};

//Eliminar un deck
export const deleteDeck = async (deckId) => {
    const response = await api.delete(`/decks/${deckId}`);
    return response.data;
};

//Obtener decks publicos (para browse)
export const getPublicDecks = async () => {
    const response = await api.get('/decks/public/all');
    return response.data;
};
