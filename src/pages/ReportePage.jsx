

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectItem } from "@/components/ui/select";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { cargarMapas } from '@/helpers/mapas';
import { ListaMapas } from '@/components/ListaMapas';

export const ReportePage = () => {

  const [ loading, setLoading ] = useState( true );
  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );


  const [ campos, setCampos ] = useState( [] );
  const [ relaciones, setRelaciones ] = useState( [] );
  const [ seleccionados, setSeleccionados ] = useState( [] );
  const [ relacionesSeleccionadas, setRelacionesSeleccionadas ] = useState( [] );
  const [ datos, setDatos ] = useState( [] );

  useEffect( () => {
    const obtenerMapas = async () => {
      setLoading( true );
      const mapas = await cargarMapas();
      
      setMapas( mapas );
      setLoading( false );
    };
    obtenerMapas();
  }, [ mapaSeleccionado ] );

  // Cargar metadatos de campos y relaciones desde el backend
  useEffect( () => {
    /* fetch("http://localhost:8080/api/reportes/metadatos")
      .then(res => res.json())
      .then(data => {
      }); */
    setCampos( [ "id", "codigo", "nombre", "tipo", "nivel", "estado", "createdAt", "updatedAt" ] );
    setRelaciones( [ "responsable", "owner", "mapa" ] );
  }, [] );

  // Consultar datos según selección
  const obtenerDatos = async () => {
    
    setDatos( [
      {
        id: 1,
        codigo: "PR-001",
        nombre: "Proceso de Compras",
        tipo: "Soporte",
        nivel: 2,
        estado: "Activo",
        createdAt: "2024-01-01",
        updatedAt: "2024-06-01",
        responsable: "Juan Pérez",
        owner: "Ana Gómez",
        mapa: "Mapa General"
      },
      {
        id: 2,
        codigo: "PR-002",
        nombre: "Proceso de Ventas",
        tipo: "Misional",
        nivel: 1,
        estado: "Activo",
        createdAt: "2024-02-01",
        updatedAt: "2024-06-10",
        responsable: "Carlos Ruiz",
        owner: "Ana Gómez",
        mapa: "Mapa General"
      }
    ] );
  };

  // Descargar como Excel
  const descargarExcel = () => {
    const ws = XLSX.utils.json_to_sheet( datos );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet( wb, ws, "Reporte" );
    const excelBuffer = XLSX.write( wb, { bookType: "xlsx", type: "array" } );
    const blob = new Blob( [ excelBuffer ], { type: "application/octet-stream" } );
    saveAs( blob, "reporte.xlsx" );
  };

  // Descargar como CSV
  const descargarCSV = () => {
    const ws = XLSX.utils.json_to_sheet( datos );
    const csv = XLSX.utils.sheet_to_csv( ws );
    const blob = new Blob( [ csv ], { type: "text/csv;charset=utf-8;" } );
    saveAs( blob, "reporte.csv" );
  };

  return (
    <article className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-center  ">Reportes por entidad</h1>
      {
        loading
          ? <p>Cargando...</p>
          :
          <>
            <ListaMapas mapas={ mapas } setMapaSeleccionado={ setMapaSeleccionado } mapaSeleccionado={ mapaSeleccionado } />
            { mapaSeleccionado && (
              <Card className="mb-4 p-5">
                <h1 className="text-xl font-bold mb-4">Generar Reporte</h1>
                <Card className="p-4">
                  <h2 className="font-semibold">Selecciona los campos:</h2>
                  <div className="flex flex-wrap gap-2 text-black">
                    { campos.map( campo => (
                      <div key={ campo } className="flex items-center gap-2">
                        <Checkbox
                          id={ `campo-${ campo }` }
                          checked={ seleccionados.includes( campo ) }
                          onCheckedChange={ checked => {
                            setSeleccionados( checked
                              ? [ ...seleccionados, campo ]
                              : seleccionados.filter( c => c !== campo ) );
                          } }
                        />
                        <Label htmlFor={ `campo-${ campo }` }>{ campo }</Label>
                      </div>
                    ) ) }
                  </div>
                </Card>
                <Card className="p-4 my-5">
                  <h2 className="font-semibold">Selecciona relaciones:</h2>
                  <div className="flex flex-wrap gap-2">
                    { relaciones.map( rel => (
                      <div key={ rel } className="flex items-center gap-2">
                        <Checkbox
                          id={ `rel-${ rel }` }
                          checked={ relacionesSeleccionadas.includes( rel ) }
                          onCheckedChange={ checked => {
                            setRelacionesSeleccionadas( checked
                              ? [ ...relacionesSeleccionadas, rel ]
                              : relacionesSeleccionadas.filter( r => r !== rel ) );
                          } }
                        />
                        <Label htmlFor={ `rel-${ rel }` }>{ rel }</Label>
                      </div>
                    ) ) }
                  </div>
                </Card>
                <Button onClick={ obtenerDatos } className="mb-4">Consultar</Button>
                { datos.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    <Button onClick={ descargarExcel }>Descargar Excel</Button>
                    <Button onClick={ descargarCSV }>Descargar CSV</Button>
                  </div>
                ) }
                { datos.length > 0 && (
                  <div className="overflow-auto">
                    <table className="min-w-full border text-xs">
                      <thead>
                        <tr>
                          { Object.keys( datos[ 0 ] ).map( key => (
                            <th key={ key } className="border px-2 py-1">{ key }</th>
                          ) ) }
                        </tr>
                      </thead>
                      <tbody>
                        { datos.map( ( fila, i ) => (
                          <tr key={ i }>
                            { Object.values( fila ).map( ( valor, j ) => (
                              <td key={ j } className="border px-2 py-1">{ String( valor ) }</td>
                            ) ) }
                          </tr>
                        ) ) }
                      </tbody>
                    </table>
                  </div>
                ) }
              </Card>
            ) }
          </>
      }



    </article>
  );
};