import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyDecks, createDeck, deleteDeck, updateDeck } from '../api/deck';
import DeckCard from '../components/DeckCard';
import CreateDeckModal from '../components/CreateDeckModal';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyDecks();
      setDecks(data);
    } catch (err) {
      setError('Error al cargar tus decks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (deckData) => {
    try {
      const newDeck = await createDeck(deckData);
      setDecks([newDeck, ...decks]);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Error al crear deck');
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (!window.confirm('¿Estás seguro de eliminar este deck?')) return;
    try {
      await deleteDeck(deckId);
      setDecks(decks.filter((d) => d.id !== deckId));
    } catch (err) {
      alert('Error al eliminar deck');
      console.error(err);
    }
  };

  const handleTogglePublic = async (deck) => {
    try {
      const updatedDeck = await updateDeck(deck.id, {
        title: deck.title,
        description: deck.description,
        is_public: !deck.is_public,
      });
      setDecks(decks.map((d) => (d.id === deck.id ? updatedDeck : d)));
    } catch (err) {
      alert('Error al actualizar deck');
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-indigo-600">📚 Flashcards</h1>
              <Link to="/browse" className="text-sm text-gray-600 hover:text-indigo-600">
                🌐 Explorar
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">👤 {user?.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con botón crear */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Mis Decks</h2>
            <p className="text-gray-600 mt-1">
              {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md hover:shadow-lg transition"
          >
            ➕ Nuevo Deck
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg">{error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-600">Cargando decks...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && decks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes decks todavía
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer deck para empezar a estudiar
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Crear Primer Deck
            </button>
          </div>
        )}

        {/* Grid de Decks */}
        {!loading && decks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onDelete={handleDeleteDeck}
                onTogglePublic={handleTogglePublic}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Crear Deck */}
      <CreateDeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDeck}
      />
    </div>
  );
}

export default Dashboard;