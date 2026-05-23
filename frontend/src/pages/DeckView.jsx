import {useState, useEffect} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDeckById } from '../api/deck';
import { createCard, updateCard, deleteCard } from '../api/cards';
import CardItem from '../components/CardItem';
import AddCardForm from '../components/AddCardForm';

function DeckView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {logout} = useAuth();

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDeck();
    }, [id]);

    const loadDeck = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getDeckById(id);
            setDeck(data.deck);   // ← CORREGIDO
            setCards(data.cards);
        } catch (err) {
            setError('Error al cargar el deck');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCard = async (cardData) => {
        try {
            const newCard = await createCard(cardData);
            setCards([...cards, newCard]);
        } catch (err) {
            throw new Error('Error al agregar la tarjeta');
        }
    };

    const handleUpdateCard = async (cardId, cardData) => {
        try {
            const updatedCard = await updateCard(cardId, cardData);
            setCards(cards.map((c) => (c.id === cardId ? updatedCard : c)));
        } catch (err) {
            throw new Error('Error al actualizar la tarjeta');
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (!window.confirm('¿Estás seguro de eliminar esta tarjeta?')) return;
        try {
            await deleteCard(cardId);
            setCards(cards.filter((c) => c.id !== cardId));
        } catch (err) {
            alert('Error al eliminar la tarjeta');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Loading state
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-xl text-gray-600'>Cargando deck...</div>
            </div>
        );
    }

    // Error state
    if (error || !deck) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-red-600 mb-4'>{error || 'Deck no encontrado'}</p>
                    <Link to="/dashboard" className='text-indigo-600 hover:underline'>
                        Volver al dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700">
                            ← Volver a Mis Decks
                        </Link>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{deck.title}</h1>
                            <p className="text-gray-600 mb-4">{deck.description || 'Sin descripción'}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>📇 {cards.length} cards</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${deck.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {deck.is_public ? 'Público' : 'Privado'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/study/${deck.id}`)}
                            disabled={cards.length === 0}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                            title={cards.length === 0 ? 'Agrega cards primero' : 'Estudiar'}
                        >
                            🎯 Estudiar
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <AddCardForm deckId={deck.id} onAdd={handleAddCard} />
                    </div>
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cards ({cards.length})</h2>
                        {cards.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay cards todavía</h3>
                                <p className="text-gray-600">Agrega tu primera card usando el formulario →</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cards.map((card) => (
                                    <CardItem key={card.id} card={card} onDelete={handleDeleteCard} onUpdate={handleUpdateCard} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DeckView;