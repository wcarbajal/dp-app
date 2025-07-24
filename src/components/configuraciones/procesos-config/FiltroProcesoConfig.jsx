import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export const FiltroProcesoConfig = ( {tipoFiltro, setTipoFiltro} ) => {
  return (
    <div className="flex gap-4 justify-end mb-4"  >
      <Select
        value={ tipoFiltro }
        onValueChange={ setTipoFiltro }

      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar tipo" />
        </SelectTrigger>
        <SelectContent className="col-span-2">
          <SelectItem value="*">Todos</SelectItem>
          <SelectItem value="Estratégico">Estratégico</SelectItem>
          <SelectItem value="Misional">Misional</SelectItem>
          <SelectItem value="Soporte">Soporte</SelectItem>
        </SelectContent>
      </Select>

    </div>
  );
};