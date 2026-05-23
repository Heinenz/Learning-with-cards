import {useState, useEffect} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDeckById } from '../api/deck';

function Study() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { loadDeck(); }, [id]);

    const loadDeck = async () => {
        try {
            setLoading(true);
            const data = await getDeckById(id);
            setDeck(data.deck);
            setCards(data.cards);
        } catch (err) {
            setError('No se pudo cargar el deck');
        } finally {
            setLoading(false);
        }
};

const handleNext = () => {
    setIsFlipped(false);

    setTimeout(() => {
        setCurrentCardIndex((prev) =>
            prev < cards.length - 1 ? prev + 1 : prev
        );
    }, 150);
};
const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentCardIndex((prev) =>
            prev > 0 ? prev - 1 : prev);
    }, 150);
};

const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
};

if (error || !deck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Deck no encontrado'}</p>
          <Link to="/dashboard" className="text-indigo-600 hover:underline">
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-2xl mb-2">😕</p>
          <p className="text-gray-700 font-semibold mb-2">Este deck no tiene cards</p>
          <Link to={`/deck/${id}`} className="text-indigo-600 hover:underline">
            Volver y agregar cards
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const isLast = currentCardIndex === cards.length - 1;
  const isFirst = currentCardIndex === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={`/deck/${id}`} className="text-indigo-600 hover:text-indigo-700 text-sm">
            ← Volver al deck
          </Link>
          <h1 className="font-semibold text-gray-800 truncate max-w-xs">{deck.title}</h1>
          <button
            onClick={handleShuffle}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            🔀 Mezclar
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Card {currentCardIndex + 1} de {cards.length}</span>
            <span>{Math.round(((currentCardIndex + 1) / cards.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard con flip */}
        <div
          className="cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '280px',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s ease',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Frente */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className="bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-8"
            >
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Pregunta</p>
              <p className="text-2xl font-medium text-gray-800 text-center">
                {currentCard.front_text}
              </p>
              <p className="text-sm text-gray-400 mt-6">Haz clic para ver la respuesta</p>
            </div>

            {/* Reverso */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="bg-indigo-600 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8"
            >
              <p className="text-xs uppercase tracking-widest text-indigo-200 mb-4">Respuesta</p>
              <p className="text-2xl font-medium text-white text-center">
                {currentCard.back_text}
              </p>
              <p className="text-sm text-indigo-300 mt-6">Haz clic para volver</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className="px-6 py-3 bg-white text-gray-700 rounded-xl shadow hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
          >
            ← Anterior
          </button>

          {isLast ? (
            <button
              onClick={() => navigate(`/deck/${id}`)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 font-medium transition"
            >
              ✅ Terminar
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isLast}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 font-medium transition"
            >
              Siguiente →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default Study;