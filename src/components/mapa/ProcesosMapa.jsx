export const ProcesosMapa = ( { procesos, tipo } ) => {

  const estrategicos = () => {
    return (
      <div className="w-[750px] h-[200px]  ">
        <div className="bg-[#31C6C6]  rounded-lg shadow py-4">
          <h2 className="text-xs font-bold text-center mb-4 border-b-2 text-white">PROCESOS ESTRATÉGICOS</h2>
          <div className="grid grid-cols-2 m-2 gap-4 items-center justify-items-center justify-center">
            { procesos.length === 0 ? (
              <span className="text-gray-500">Sin procesos estratégicos</span>
            ) : (
              procesos.map( proc => (
                <div key={ proc.id } className="flex items-center gap-5 bg-white border text-xs border-cyan-400 rounded-md px-4 py-2 shadow text-center h-[52px] w-[300px]"                        >
                  <span className="font-mono text-cyan-700 font-semibold ">{ proc.codigo }</span>
                  <div className="w-px bg-gray-300 h-full " />
                  <span className="text-gray-700 w-full text-center">{ proc.nombre }</span>
                </div>
              ) )
            ) }
          </div>
        </div>
        <div className="w-0 h-0 mx-auto rotate-180"
          style={ {
            borderLeft: "370px solid transparent",
            borderRight: "370px solid transparent",
            borderBottom: "24px solid #31C6C6"
          } } />
      </div>
    );
  };

  const misionales = (procesos) => {
    return (
      <div className="flex items-center mt-5 ">

        <div className="bg-[#C60094]  w-[750px] h-[160px] rounded-2xl flex flex-col">
          {/* ...contenido... */ }

          <h2 className="text-xs font-bold text-center mb-3 p-2 border-b-2 text-white">PROCESOS MISIONALES</h2>
          <div className="grid grid-cols-4 m-2 gap-2 items-center justify-items-center ">
            { procesos.length === 0 ? (
              <span className="text-gray-500">Sin procesos operativos</span>
            ) : (
              procesos.map( proc => (
                <div
                  key={ proc.id }
                  className="flex items-center gap-5 text-xs bg-white border border-cyan-400 rounded-md px-4 py-2 shadow text-center h-[70px] w-[170px]"
                >
                  <span className="font-mono text-fuchsia-700 font-semibold">{ proc.codigo }</span>
                  <div className="w-px bg-gray-300 h-full " />
                  <span className="text-gray-700">{ proc.nombre }</span>
                </div>
              ) )
            ) }
          </div>
        </div>

        <div
          className="w-0 h-0 ml-0"
          style={ {
            borderTop: "70px solid transparent",
            borderBottom: "70px solid transparent",
            borderLeft: "24px solid #C60094"
          } }
        />
      </div>
    );
  };
  const soporte = (procesos) => {
    return (
      <div className="w-[750px] mx-auto h-[250px]">
        <div
          className="w-0 h-0 mx-auto "
          style={ {
            borderLeft: "350px solid transparent",
            borderRight: "350px solid transparent",
            borderBottom: "24px solid #517E33"
          } }
        />
        <div className="bg-[#517E33] rounded-lg shadow p-4">
          <h2 className="text-xs font-bold text-center  mb-4 border-b-2 text-white">PROCESOS DE SOPORTE</h2>
          <div className="grid grid-cols-3 gap-4 items-center justify-items-center justify-center">
            { procesos.length === 0 ? (
              <span className="text-gray-500">Sin procesos de soporte</span>
            ) : (
              procesos.map( proc => (
                <div
                  key={ proc.id }
                  className="flex items-center gap-5 bg-white border border-cyan-400 rounded-md px-4 py-2 shadow text-center text-xs h-[60px] w-[200px]"
                >
                  <span className="font-mono text-lime-700 font-semibold">{ proc.codigo }</span>
                  <div className="w-px bg-gray-300 h-full " />
                  <span className="text-gray-700">{ proc.nombre }</span>
                </div>
              ) )
            ) }
          </div>
        </div>
      </div>          
  )
}

return (
  tipo === "estrategicos" ? estrategicos(procesos) :
  tipo === "misionales" ? misionales(procesos) :
  tipo === "soporte" ? soporte(procesos) : null
);
};