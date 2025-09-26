import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, Search } from 'tabler-icons-react';
import { fetchConToken } from '@/helpers/fetch';

export const AgregarIndicador = ({ mapaId, onIndicadoresAgregados }) => {
  const [indicadores, setIndicadores] = useState([]);
  const [selectedIndicadores, setSelectedIndicadores] = useState([]);
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const cargarIndicadores = async () => {
      if (!mapaId) return;
      
      try {
        console.log('🔵 Cargando indicadores para mapa:', mapaId);
        const listaIndicadores = await fetchConToken(`indicador/${mapaId}`);
        setIndicadores(listaIndicadores.indicadores || []);
      } catch (error) {
        console.log('🔴 Error al cargar indicadores:', error);
      }
    };

    if (open) {
      cargarIndicadores();
    }
  }, [mapaId, open]);

  // Filtrar indicadores basado en el input
  const indicadoresFiltrados = indicadores.filter(indicador => {
    if (!filtro) return true;
    
    const filtroLower = filtro.toLowerCase();
    return (
      indicador.nombre?.toLowerCase().includes(filtroLower) ||
      indicador.codigo?.toLowerCase().includes(filtroLower) ||
      indicador.nivelIndicador?.toLowerCase().includes(filtroLower) ||
      indicador.tipoIndicador?.toLowerCase().includes(filtroLower) ||
      indicador.descripcion?.toLowerCase().includes(filtroLower)
    );
  });

  // Manejar selección/deselección de indicadores
  const handleCheckboxChange = (indicadorId, checked) => {
    if (checked) {
      setSelectedIndicadores(prev => [...prev, indicadorId]);
    } else {
      setSelectedIndicadores(prev => prev.filter(id => id !== indicadorId));
    }
  };

  // Limpiar filtro y selecciones al cerrar
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFiltro('');
      setSelectedIndicadores([]);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviando indicadores seleccionados:', selectedIndicadores);
    
    if (selectedIndicadores.length === 0) {
      alert('Selecciona al menos un indicador');
      return;
    }

    console.log('Indicadores seleccionados:', selectedIndicadores);
    
    // Llamar función del componente padre para agregar los indicadores
    if (onIndicadoresAgregados) {
      onIndicadoresAgregados(selectedIndicadores);
    }
    
    // Limpiar selección y cerrar dialog
    setSelectedIndicadores([]);
    setFiltro('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Agregar indicador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Indicadores disponibles</DialogTitle>
            <DialogDescription>
              Selecciona los indicadores para el proceso actual.
            </DialogDescription>
          </DialogHeader>
          
          {/* Campo de filtro */}
          <div className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Filtrar por nombre, código, nivel o tipo..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-10"
              />
            </div>
            {filtro && (
              <div className="text-sm text-gray-500 mt-2">
                {indicadoresFiltrados.length} de {indicadores.length} indicadores mostrados
              </div>
            )}
          </div>
          
          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
            {indicadoresFiltrados.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">
                {filtro 
                  ? `No se encontraron indicadores que coincidan con "${filtro}"`
                  : "No hay indicadores disponibles para agregar."
                }
              </p>
            ) : (
              <div className="space-y-3">
                {indicadoresFiltrados.map((indicador) => (
                  <div key={indicador.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={`indicador-${indicador.id}`}
                      checked={selectedIndicadores.includes(indicador.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(indicador.id, checked)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <label 
                        htmlFor={`indicador-${indicador.id}`} 
                        className="text-sm font-medium cursor-pointer block"
                      >
                        {indicador.codigo} - {indicador.nombre}
                      </label>
                      {indicador.descripcion && (
                        <p className="text-xs text-gray-600 mt-1">
                          {indicador.descripcion}
                        </p>
                      )}
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {indicador.nivelIndicador}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {indicador.tipoIndicador}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedIndicadores.length > 0 && (
            <div className="text-sm text-gray-600 mb-4">
              {selectedIndicadores.length} indicador(es) seleccionado(s)
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                type="button"
                onClick={() => {
                  setSelectedIndicadores([]);
                  setFiltro('');
                }}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={selectedIndicadores.length === 0}
            >
              Agregar {selectedIndicadores.length > 0 && `(${selectedIndicadores.length})`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};