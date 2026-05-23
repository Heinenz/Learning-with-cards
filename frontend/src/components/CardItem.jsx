import {useState} from 'react';

function CardItem({ card, onDelete, onUpdate}) {
    const [isEditing, setIsEditing] = useState(false);
    const [frontText, setFrontText] = useState(card.front_text);
    const [backText, setBackText] = useState(card.back_text);
    
    const handleSave = async () => {
        if (!frontText.trim() || !backText.trim) {
            alert(' Ambos lados de la tarjeta deben tener texto.');
            return;
        }
    setLoading(true);
        try {
            await onUpdate(card.id, { 
                front_text: frontText.trim(),
                back_text: backText.trim(),
                position: card.position,
            });
            setIsEditing(false);
        } catch (err) {
            alert('Error al actualizar la tarjeta: ');
        } finally {
            setLoading(false);
        }
};

const handleCancel = () => {
    setFrontText(card.front_text);
    setBackText(card.back_text);
    setIsEditing(false);
};

if (isEditing) {
    return (
        <div className= "bg-white rounded-lg shadow p-4 border-indigo-500 ">
         <div className='space-y-3'>
            {/* Input front */}
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Frente
                </label>
                <textarea 
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                rows="2"
                disabled={loading}/>
            </div>
            {/* Input back */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Reverso
                </label>
                <textarea 
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                rows="2"
                disabled={loading}/>
            </div>
            {/* Buttons */}
            <div className='flex gap-2'>
                <button onClick={handleSave}
                disabled={loading}
                className='flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400'>
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={handleCancel}
                disabled={loading}
                className='flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200'>
                    Cancelar
                </button>
            </div>
        </div>
    );
}

return (
     <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      {/* Contenido de la card */}
      <div className="mb-3">
        <div className="mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            Frente
          </span>
          <p className="text-gray-900 mt-1">{card.front_text}</p>
        </div>
        <div className="border-t pt-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            Reverso
          </span>
          <p className="text-gray-700 mt-1">{card.back_text}</p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => onDelete(card.id)}
          className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default CardItem;