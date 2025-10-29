import { fetchConToken } from './fetch';

export const cargarUsuarios = async () => {
  try {
    console.log('Intentando cargar usuarios...');

    const response = await fetchConToken('usuarios', {}, 'GET');

    console.log('Respuesta del servidor:', response);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText || 'Error al cargar usuarios'}`);
    }
    
    // Verificar si tenemos datos
    if (response.usuarios && Array.isArray(response.usuarios)) {
      return response.usuarios;
    } else {
      console.warn('Estructura de respuesta inesperada:', response);
      return [];
    }
    
  } catch (error) {
    console.error('Error en cargarMapas:', error);
    
    // Si es un error de parsing JSON, es probable que sea una página HTML de error
    if (error.message.includes('Unexpected token')) {
      console.error('El servidor devolvió HTML en lugar de JSON. Verifica la URL del endpoint.');
    }
    
    throw error;
  }
};