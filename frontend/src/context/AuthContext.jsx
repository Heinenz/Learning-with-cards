import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  setToken, 
  getToken, 
  setUser, 
  getUser, 
  clearAuth 
} from '../utils/auth';

// 1. Crear el Context
const AuthContext = createContext(null);

// 2. Hook personalizado para usar el Context fácilmente
// En vez de: useContext(AuthContext)
// Usas: useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// 3. Provider component
export const AuthProvider = ({ children }) => {
  // Estado: usuario actual (null si no está logueado)
  const [user, setUserState] = useState(null);
  
  // Estado: indica si estamos cargando datos (ej: verificando token al inicio)
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // 4. useEffect: Se ejecuta UNA VEZ al montar el componente
  // Verifica si hay un token guardado y restaura la sesión
  useEffect(() => {
    const initAuth = () => {
      const token = getToken();
      const savedUser = getUser();
      
      if (token && savedUser) {
        // Hay token y usuario guardados → restaurar sesión
        setUserState(savedUser);
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // 5. Función LOGIN
  // Recibe email y password, llama al backend
  const login = async (email, password) => {
    try {
      // Llamada al backend: POST /auth/login
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      // Extraer token y user de la respuesta
      const { token, user } = response.data;
      
      // Guardar en localStorage
      setToken(token);
      setUser(user);
      
      // Actualizar estado local
      setUserState(user);
      
      // Redirigir a dashboard
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      // Si hay error (credenciales incorrectas, etc)
      const message = error.response?.data?.error || 'Error al iniciar sesión';
      return { success: false, error: message };
    }
  };

  // 6. Función SIGNUP
  const signup = async (email, username, password) => {
    try {
      // Llamada al backend: POST /auth/signup
      const response = await api.post('/auth/signup', { 
        email, 
        username, 
        password 
      });
      
      // Después de signup exitoso, hacer login automático
      // (Algunos apps requieren que hagas login manual después de signup)
      // Nosotros lo hacemos automático por UX
      return await login(email, password);
    } catch (error) {
      const message = error.response?.data?.error || 'Error al registrarse';
      return { success: false, error: message };
    }
  };

  // 7. Función LOGOUT
  const logout = () => {
    // Limpiar todo: localStorage y estado
    clearAuth();
    setUserState(null);
    
    // Redirigir a login
    navigate('/login');
  };

  // 8. Valor que el Context provee a todos los componentes
  const value = {
    user,           // Usuario actual (null si no logueado)
    loading,        // Boolean: true mientras verifica sesión inicial
    login,          // Función para hacer login
    signup,         // Función para registrarse
    logout,         // Función para cerrar sesión
    isAuthenticated: !!user,  // Boolean: true si hay usuario
  };

  // 9. Mostrar loading mientras verifica sesión inicial
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  // 10. Proveer el Context a todos los children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};