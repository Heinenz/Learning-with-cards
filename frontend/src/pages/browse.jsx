import {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublicDecks } from '../api/deck';
import {useAuth} from '../context/AuthContext';

function Browse() {
    const {logout} = useAuth();
    const navigate = useNavigate();

    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    
    useEffect(() => { loadPublicDecks(); }, []);

    const loadPublicDecks = async () => {
        try {
            setLoading(true);
            const data = await getPublicDecks();
            setDecks(data);
        } catch (err) {
            setError('No se pudieron cargar los decks públicos');
        console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = decks.filter((deck) =>
        deck.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleLogout = () => {
    localStorage.removeItem('token');
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
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600">
                Mis Decks
              </Link>
              <span className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1">
                Explorar
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Explorar Decks</h2>
          <p className="text-gray-600">Descubre decks creados por la comunidad</p>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar decks..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg">{error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">Cargando decks...</p>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search ? 'No se encontraron resultados' : 'No hay decks públicos todavía'}
            </h3>
            <p className="text-gray-600">
              {search
                ? 'Intenta con otro término de búsqueda'
                : 'Sé el primero en compartir un deck'}
            </p>
          </div>
        )}

        {/* Grid de decks */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((deck) => (
              <div
                key={deck.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">
                    {deck.title}
                  </h3>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 ml-2 shrink-0">
                    Público
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {deck.description || 'Sin descripción'}
                </p>

                <p className="text-xs text-gray-400 mb-4">
                  Por <span className="font-medium text-gray-600">{deck.username}</span>
                </p>

                <Link
                  to={`/study/${deck.id}`}
                  className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition"
                >
                  🎴 Estudiar este deck
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Browse;