import { Route, Routes } from 'react-router';

import { ProcesoPage } from '@/pages/ProcesoPage';
import { PrincipalPage } from '@/pages/Principal';
import { SectionCards } from '@/components/section-cards';
import { ReportePage } from '@/pages/ReportePage';

import { EquipoPage } from '@/pages/EquipoPage';
import { MapaPage } from '@/pages/MapaPage';
import { ConfiguracionesPage } from '@/pages/ConfiguracionesPage';

import { UsuariosConfig } from '@/components/configuraciones/UsuariosConfig';
import { ReportesConfig } from '@/components/configuraciones/ReportesConfig';
import { ProcesosConfig } from '@/components/configuraciones/procesos-config/ProcesosConfig';
import { MapaConfig } from '@/components/configuraciones/mapa-config/MapaConfig';


export const PrincipalRouter = () => {
  return (

    <Routes >
      <Route path="/" element={ <PrincipalPage /> } >
        <Route index element={ <SectionCards /> } />
        <Route path="procesos" element={ <ProcesoPage /> } />
        <Route path="mapa" element={ <MapaPage /> } />
        <Route path="reportes" element={ <ReportePage /> } />
        <Route path="equipo" element={ <EquipoPage /> } />
        <Route path="configuraciones" element={ <ConfiguracionesPage /> } />
        <Route path="configuraciones/procesos" element={ <ProcesosConfig /> } />
        <Route path="configuraciones/usuarios" element={ <UsuariosConfig /> } />
        <Route path="configuraciones/reportes" element={ <ReportesConfig /> } />
        <Route path="configuraciones/mapa" element={ <MapaConfig /> } />


      </Route>

    </Routes>


  );
};