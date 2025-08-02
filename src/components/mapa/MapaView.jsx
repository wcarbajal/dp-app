
export const MapaView = (entrada, salida, estrategicos, misionales, soporte) => {
  return (
    <div className="flex gap-5 h-[650px] m-2 rounded-2xl w-[900px]">

      {/* entradas */ }
      <EntradaSalida objetivo={ entrada } />

      {/* Procesos */ }
      <div className="flex gap-5 flex-col ">
        {/* Procesos Estratégicos */ }
        <ProcesosMapa procesos={ estrategicos } tipo="estrategicos" />
        {/* Procesos Misionales */ }
        <ProcesosMapa procesos={ misionales } tipo="misionales" />

        {/* Procesos de Soporte */ }
        <ProcesosMapa procesos={ soporte } tipo="soporte" />

      </div>

      {/* Salida */ }
      <EntradaSalida objetivo={ salida } />
    </div>
  );
};