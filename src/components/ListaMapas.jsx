
import { useEffect, useState } from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const ListaMapas = ({ mapas, setMapaSeleccionado, mapaSeleccionado }) => {
  const [selected, setSelected] = useState("none");

  useEffect(() => {
    if (mapaSeleccionado && mapaSeleccionado.id) {
      setSelected(String(mapaSeleccionado.id));
    } else {
      setSelected("none");
    }
  }, [mapaSeleccionado]);

  const handleMapaSeleccionado = (value) => {
    setSelected(value);
    const mapa = mapas.find(m => m.id === Number(value));
    setMapaSeleccionado(mapa);
  };

  return (
    <article className="flex flex-row gap-2 justify-center items-center  py-2 px-6 rounded-lg   ">
      <Label>Selecciona un mapa: </Label>
      <Select value={selected} onValueChange={handleMapaSeleccionado}>
        <SelectTrigger className="min-w-48 bg-white  boderder-gray-300 hover:border-gray-400 focus:border-primary focus:ring-0">
          <SelectValue placeholder="Mapas disponibles" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="none">No seleccionado</SelectItem>
            {mapas.map(mapa => (
              <SelectItem key={mapa.id} value={String(mapa.id)}>
                {mapa.nombre}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </article>
  );
};