import axios from 'axios';
//URL del backend
// En desarrollo usar localhost:3000
// En produccion se cambiara esto a la URL de Railway
const API_URL = 'http://localhost:3000';

// Crear una instacia de axios con configuracion base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//Interceptor: se ejecuta antes de cada solicitud/request
//Agrega el token JWT automaticamente si existe
api.interceptors.request.use(
    (config) => {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        // Si existe, agregarlo al header Authorization
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;

    },
    (error) => {
        return Promise.reject(error);
    }
);

//Interceptor: se ejecuta despues de cada respuesta/response
//Maneja errores de autenticacion (token expirado, invalido, etc)
api.interceptors.response.use(
    (response) => {
        // Si la respuesta es exitosa, simplemente retornarla
        return response;
    },
    (error) => {
        // Si el error es 401 (No autorizado)
        if (error.response && error.response.status === 401){
            // Limpiar token invalido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirigir al login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;