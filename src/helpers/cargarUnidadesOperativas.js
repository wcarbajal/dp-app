
import { fetchConToken } from '@/helpers/fetch';

/**
 * Obtiene las unidades operativas por mapaId.
 * @param {string|number} mapaId
 * @returns {Promise<Array>} Unidades operativas o []
 */
export async function cargarUnidadesOperativas(mapaId) {
  if (!mapaId) return [];
  try {
    const respuesta = await fetchConToken(`unidad-operativa/${mapaId}`);
    if (respuesta.ok) {
      return respuesta.unidades;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al cargar unidades operativas:", error);
    return [];
  }
}