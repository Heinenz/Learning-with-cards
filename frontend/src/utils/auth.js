// Guardar token en localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Obtener token de localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Eliminar token de localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Guardar datos del usuario en localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Obtener datos del usuario de localStorage
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Eliminar datos del usuario
export const removeUser = () => {
  localStorage.removeItem('user');
};

// Verificar si hay un usuario logueado
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Limpiar toda la sesión
export const clearAuth = () => {
  removeToken();
  removeUser();
};