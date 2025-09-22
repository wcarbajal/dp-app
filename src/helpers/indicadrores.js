
import { fetchConToken } from '@/helpers/fetch';

/**
 * Obtiene las unidades operativas por mapaId.
 * @param {string|number} mapaId
 * @returns {Promise<Array>} Unidades operativas o []
 */
export async function cargarIndicadores(mapaId) {

  if (!mapaId) return [];
  try {
    const respuesta = await fetchConToken(`indicador/${mapaId}`);
    
    if (respuesta.ok) {
      return {  indicadores: respuesta.indicadores, indicadoresJSON: respuesta.indicadoresJSON };
    } else {
      return { indicadores: [], indicadoresJSON: [] };
    }
  } catch (error) {
    console.error("Error al cargar indicadores:", error);
    return { indicadores: [], indicadoresJSON: [] };
  }
}