import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup(){
    //Estados para los inputs del form
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //Estados para UI
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Hook de AuthContext para manejar autenticacion
    const { signup } = useAuth();

    // Hook de React Router para navegar
    const navigate = useNavigate();

    // Funcion que se ejecuta al hacer submit en el form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validacion basica en el frontend
        if (!email || !username || !password || !confirmPassword) {
            setError(' Por favor completa todos los campos');
            return;
        }
        //Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            setError('Por favor ingresa un email valido');
            return;
        }
        //Validar username (minimo 3 caracteres)
        if (username.length < 3) {
            setError('El nombre de usuario debe tener al menos 3 caracteres');
            return;
        }
        //Validar password (minimo 6 caracteres)
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        //Validar que passwords coincidan
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        try {
            //Llamar a signup del AuthContext
            const result = await signup(email, username,password);

            if (result.success){
                //Signup exitoso, -> Authcontext ya guardo token y user
                // Redirigir al dashboard
                navigate('/dashboard');
            } else {
                // Error (email ya existe,etc)
                setError(result.message);
            }
        } catch (err) {
            setError('Ocurrio un error. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    }
     return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Únete y comienza a estudiar
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

          <div className="rounded-md shadow-sm space-y-4">
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                disabled={loading}
              />
            </div>

            {/* Input: Username */}
            <div>
              <label htmlFor="username" className="sr-only">
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre de usuario"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña (mínimo 6 caracteres)"
                disabled={loading}
              />
            </div>

            {/* Input: Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar contraseña"
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
                  Creando cuenta...
                </span>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>

          {/* Link a Login */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;

