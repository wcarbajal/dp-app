
import { useContext, useEffect } from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EntidadContext } from '@/context/EntidadContext';
import { Card } from './ui/card';

export const ListaMapas = ( { mapas, setMapaSeleccionado, mapaSeleccionado } ) => {

  const { defaultEntidad, setDefaultEntidad } = useContext( EntidadContext );

  

  /* useEffect( () => {
    if ( !defaultEntidad  )  {
      setDefaultEntidad('none')
      return
    }
    setDefaultEntidad( String( defaultEntidad ) );

  }, [defaultEntidad, setDefaultEntidad] ); */

  useEffect( () => {
    if ( mapas && mapas.length > 0 && ( !mapaSeleccionado || !mapaSeleccionado.id ) ) {
      setDefaultEntidad( String( mapas[ 0 ].id ) );
      setMapaSeleccionado( mapas[ 0 ] );
    }
  }, [mapas, mapaSeleccionado, setMapaSeleccionado, setDefaultEntidad] );

  useEffect( () => {
    if ( mapaSeleccionado && mapaSeleccionado.id ) {
      setDefaultEntidad( String( mapaSeleccionado.id ) );
    } else {
      //setDefaultEntidad( "none" );
    }
  }, [mapaSeleccionado, setDefaultEntidad] );

  const handleMapaSeleccionado = ( value ) => {
    setDefaultEntidad( value );
    const mapa = mapas.find( m => m.id === Number( value ) );
    setMapaSeleccionado( mapa );
  };

  return (
    <Card className="flex flex-row gap-2 justify-center items-center my-2  py-2 px-6 rounded-lg  h-full  max-w-[800px]">
      <Label>Seleccione una entidad: </Label>
      <Select value={ defaultEntidad } onValueChange={ handleMapaSeleccionado }>
        <SelectTrigger className="min-w-48 bg-white  boderder-gray-300 hover:border-gray-400 focus:border-primary focus:ring-0">
          <SelectValue placeholder="Mapas disponibles" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="none">No seleccionado</SelectItem>
            { mapas.map( mapa => (
              <SelectItem key={ mapa.id } value={ String( mapa.id ) }>
                { mapa.nombre }
              </SelectItem>
            ) ) }
          </SelectGroup>
        </SelectContent>
      </Select>
    </Card>
  );
};