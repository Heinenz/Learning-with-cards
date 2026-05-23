import { useState } from "react";

function AddCardForm({ deckId, onAdd }) {
    const [frontText, setFrontText] = useState('');
    const [backText, setBackText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!frontText.trim() || !backText.trim()) {
            setError('Ambos lados de la tarjeta deben tener texto.');
            return;
        }
  setLoading(true);
  try {
    await onAdd({
        deck_id: deckId,
        front_text: frontText.trim(),
        back_text: backText.trim(),
        position: 0,
    });

    //Limpiar el formulario después de agregar la tarjeta
    setFrontText('');
    setBackText('');
  } catch (err) {
    setError('Error al agregar la tarjeta');
    } finally {
        setLoading(false); 
    }
  };
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        ➕ Agregar Nueva Card
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Front */}
        <div>
          <label
            htmlFor="front"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Frente (Pregunta)
          </label>
          <textarea
            id="front"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            placeholder="¿Qué es React?"
            disabled={loading}
          />
        </div>

        {/* Input Back */}
        <div>
          <label
            htmlFor="back"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reverso (Respuesta)
          </label>
          <textarea
            id="back"
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            placeholder="Una librería de JavaScript para construir interfaces de usuario"
            disabled={loading}
          />
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 font-medium"
        >
          {loading ? 'Agregando...' : 'Agregar Card'}
        </button>
      </form>
    </div>
  );
}

export default AddCardForm;      
