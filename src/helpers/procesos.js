import { fetchConToken } from "@/helpers/fetch";

export const cargarProcesos = async (idMapa) => {
  if (!idMapa) return [];
  try {
    const respuesta = await fetchConToken(`mapa/${idMapa}/procesos-lista`);
    if (respuesta.ok) {
      return respuesta.procesos;
    }
    return [];
  } catch (error) {
    console.error("Error al cargar procesos asociados:", error);
    return [];
  }
};

export const cargarProcesosNivel0 = async (idMapa) => {
  if (!idMapa) return [];
  try {
    const respuesta = await fetchConToken(`mapa/${idMapa}/primer-nivel`);
    if (respuesta.ok) {
      return respuesta.procesos;
    }
    return [];
  } catch (error) {
    console.error("Error al cargar procesos asociados:", error);
    return [];
  }
};