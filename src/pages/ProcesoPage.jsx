import { DiagramaProceso } from '@/components/procesos/DiagramaProceso';
import { ListaProcesos } from '@/components/procesos/ListaProcesos';

export const ProcesoPage = () => {
  return (
   <div className="grid grid-cols-12 flex-1 min-h-0 h-full ">
      <div className="p-4 col-span-4 lg:col-span-3 xl:col-span-2 h-full flex flex-col min-h-0 border-r">
        <ListaProcesos />
      </div>


      <div className=" p-4 col-span-8 lg:col-span-9 xl:col-span-10 h-full flex flex-col min-h-0">
        <DiagramaProceso /> 
      </div>
    </div>
  );
};