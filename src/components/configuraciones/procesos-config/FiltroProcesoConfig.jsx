import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export const FiltroProcesoConfig = ( {tipoFiltro, setTipoFiltro} ) => {
  return (
    <div className="flex gap-4 justify-start mb-4  "  >
      <Select
        value={ tipoFiltro }
        onValueChange={ setTipoFiltro }

      >
        <SelectTrigger className="border-slate-300 w-64">
          <SelectValue placeholder="Filtrar tipo" />
        </SelectTrigger>
        <SelectContent className="col-span-2">
          <SelectItem key="todos" value="*">Todos</SelectItem>
          <SelectItem key="estrategico" value="Estratégico">Estratégico</SelectItem>
          <SelectItem key="misional" value="Misional">Misional</SelectItem>
          <SelectItem key="soporte" value="Soporte">Soporte</SelectItem>
        </SelectContent>
      </Select>

    </div>
  );
};