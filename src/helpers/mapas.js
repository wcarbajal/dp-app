import { fetchConToken } from './fetch';

export const cargarMapas = async () => {
  try {
    const respuesta = await fetchConToken("mapa");
    if (respuesta.ok) {
      return respuesta.mapas;
    }
    return [];
  } catch (error) {
    console.error("Error al cargar mapas:", error);
    return [];
  }
};