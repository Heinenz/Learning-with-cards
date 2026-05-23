import { Link } from "react-router-dom";

function DeckCard({deck, onDelete, onTogglePublic}) {
// deck = {id, title, description, is_public, created_at}
      return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header con título */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">
          {deck.title}
        </h3>
        
        {/* Badge público/privado */}
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            deck.is_public
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {deck.is_public ? 'Público' : 'Privado'}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {deck.description || 'Sin descripción'}
      </p>

      {/* Info de cards (lo agregaremos después) */}
      <div className="text-sm text-gray-500 mb-4">
        📇 Cards (próximamente)
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        {/* Botón Ver/Estudiar */}
        <Link
          to={`/deck/${deck.id}`}
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center text-sm font-medium"
        >
          Ver Deck
        </Link>

        {/* Botón Toggle Público/Privado */}
        <button
          onClick={() => onTogglePublic(deck)}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          title={deck.is_public ? 'Hacer privado' : 'Hacer público'}
        >
          {deck.is_public ? '🔓' : '🔒'}
        </button>

        {/* Botón Eliminar */}
        <button
          onClick={() => onDelete(deck.id)}
          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          title="Eliminar deck"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default DeckCard;