import api from './axios';

//Crear una nueva carta
export const createCard = async (cardData) => {
    // cardData = { deck_id, front_,back_text,position}
    const response = await api.post('/cards', cardData);
    return response.data;

}

//Actualizar una carta existente
export const updateCard = async (cardId, cardData) => {
    const response = await api.put(`/cards/${cardId}`, cardData);
    return response.data;
}

//Eliminar una carta
export const deleteCard = async (cardId) => {
    const response = await api.delete(`/cards/${cardId}`);
    return response.data;
}