import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function login(){
  //Estados para los inputs del form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //Estados para UI
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hook de AuthContext para manejar autenticacion
  const { login } = useAuth();

  // Hook de React Router para navegar
  const navigate = useNavigate();

  // Funcion que se ejecuta al hacer submit en el form
  const handleSubmit = async (e) => {
    // Prevenir reload de pagina (comportamiento por defecto del form)
    e.preventDefault();

    // Limpiar error anterior
    setError('');

    // Validacion basica en el frontend
    if (!email || !password){
      setError('Por favor ingresa email y contraseña');
      return;
    }

    //Validacion de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
      setError('Por favor ingresa un email valido');
      return;
    }
    //Mostrar loading mientras se procesa el login
    setLoading(true);
    try {
      // Llamar a la funcion de login del AuthContext
      const result = await login(email, password);

      // Si el login fue existoso
      if (result.success){
        // AuthContext ya guardo el token y user
        // Redirigir al dashboard
        navigate('/dashboard');
      } else {
        // Si hubo un error en el login
        setError(result.message);
      }
    } catch (err) {
      // Si hubo un error inesperado (ej: error de red)
      setError('Ocurrio un error. Por favor intenta de nuevo.');
    } finally {
      // Ocultar loading
      setLoading(false);
  }
};

return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tus flashcards
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Mensaje de error */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            {/* Input: Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                disabled={loading}
              />
            </div>

            {/* Input: Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                disabled={loading}
              />
            </div>
          </div>

          {/* Botón Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          {/* Link a Signup */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default login;