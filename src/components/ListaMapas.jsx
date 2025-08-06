
import { useEffect, useState } from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const ListaMapas = ({ mapas, setMapaSeleccionado, mapaSeleccionado }) => {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (mapaSeleccionado && mapaSeleccionado.id) {
      setSelected(String(mapaSeleccionado.id));
    } else {
      setSelected("");
    }
  }, [mapaSeleccionado]);

  const handleMapaSeleccionado = (value) => {
    setSelected(value);
    const mapa = mapas.find(m => m.id === Number(value));
    setMapaSeleccionado(mapa);
  };

  return (
    <div className="flex flex-row gap-2 justify-center items-center mt-5">
      <Label>Selecciona un mapa: </Label>
      <Select value={selected} onValueChange={handleMapaSeleccionado}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Mapas disponibles" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {mapas.map(mapa => (
              <SelectItem key={mapa.id} value={String(mapa.id)}>
                {mapa.nombre}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};