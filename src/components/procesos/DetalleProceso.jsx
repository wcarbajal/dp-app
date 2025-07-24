
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const DetalleProceso = ( { proceso } ) => {
  return (
    <div>
      <h2 className="font-bold mb-2">{ proceso.codigo } - { proceso.nombre }</h2>

      <div className="w-full h-full flex flex-col">
        <Tabs defaultValue="descripcion" className="w-full h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="descripcion">Descripción</TabsTrigger>
            <TabsTrigger value="diagrama">Diagrama</TabsTrigger>
            <TabsTrigger value="ficha">Ficha</TabsTrigger>
            <TabsTrigger value="procedimiento">Procedimiento</TabsTrigger>
            <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          </TabsList>
          <TabsContent value="descripcion" className="flex-1 w-full h-full p-4">
            <h2 className="font-bold mb-2">Descripción</h2>
            <p>{ proceso.descripcion || "Sin descripción disponible." }</p>
          </TabsContent>
          <TabsContent value="diagrama" className="flex-1 w-full h-full p-4">
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={ proceso.imagenUrl }
                alt={ `Diagrama de ${ proceso.nombre }` }
                className="w-full h-full object-contain"
                style={ { maxHeight: "100%", maxWidth: "100%" } }
              />
            </div>
          </TabsContent>
          <TabsContent value="ficha" className="flex-1 w-full h-full p-4">
            <h2 className="font-bold mb-2">Ficha</h2>
            <p>{ proceso.ficha || "Sin ficha disponible." }</p>
          </TabsContent>
          <TabsContent value="procedimiento" className="flex-1 w-full h-full p-4">
            <h2 className="font-bold mb-2">Procedimiento</h2>
            <p>{ proceso.procedimiento || "Sin procedimiento disponible." }</p>
          </TabsContent>
          <TabsContent value="indicadores" className="flex-1 w-full h-full p-4">
            <h2 className="font-bold mb-2">Indicadores</h2>
            <p>{ proceso.indicadores || "Sin indicadores disponibles." }</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};