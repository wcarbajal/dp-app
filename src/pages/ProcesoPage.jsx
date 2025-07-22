import { DiagramaProceso } from '@/components/procesos/DiagramaProceso';
import { ListaProcesos } from '@/components/procesos/ListaProcesos';

export const ProcesoPage = () => {
  return (
   <div className="grid grid-cols-12 flex-1 min-h-0 h-full ">
      <div className="p-4 col-span-5 lg:col-span-3 xl:col-span-2 h-full flex flex-col min-h-0 border-r">
        <ListaProcesos />
      </div>


      <div className=" p-4 col-span-7 lg:col-span-9 xl:col-span-10 h-full flex flex-col min-h-0">
        <DiagramaProceso /> 
      </div>
    </div>
  );
};