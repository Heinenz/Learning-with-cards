import { useState } from 'react';

function CreateDeckModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form cuando se cierra
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setIsPublic(false);
    setError('');
    onClose();
  };

  // Submit del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación
    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }

    setLoading(true);

    try {
      // Llamar callback del padre con los datos
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        is_public: isPublic,
      });

      // Si llegó aquí, fue exitoso
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al crear deck');
    } finally {
      setLoading(false);
    }
  };

  // Si modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    // Overlay oscuro
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal */}
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Crear Nuevo Deck
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Input: Título */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Vocabulario Inglés"
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Input: Descripción */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe tu deck..."
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Checkbox: Público */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">
                Hacer este deck público (otros usuarios podrán verlo)
              </span>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDeckModal;