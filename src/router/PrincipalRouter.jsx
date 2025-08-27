import { Route, Routes } from 'react-router';

import { ProcesosPage } from '@/pages/ProcesosPage';
import { ProcesoPage } from '@/pages/ProcesoPage';
import { PrincipalPage } from '@/pages/Principal';
import { DashboardCards } from '@/components/SectionCards';
import { ReportePage } from '@/pages/ReportePage';

import { EquipoPage } from '@/pages/EquipoPage';
import { MapaPage } from '@/pages/MapaPage';
import { ConfiguracionesPage } from '@/pages/ConfiguracionesPage';

import { UsuariosConfig } from '@/components/configuraciones/UsuariosConfig';
import { ReportesConfig } from '@/components/configuraciones/ReportesConfig';
import { ProcesosConfig } from '@/components/configuraciones/procesos-config/ProcesosConfig';
import { MapaConfig } from '@/components/configuraciones/mapa-config/MapaConfig';

import { OwnersConfig } from '@/components/configuraciones/owners-config/OwnersConfig';
import { PerfilUser } from '@/pages/PerfilUser';



export const PrincipalRouter = () => {
  return (

    <Routes >
      <Route path="/" element={ <PrincipalPage /> } >
        <Route index element={ <DashboardCards /> } />
        <Route path="procesos" element={ <ProcesosPage /> } />
        <Route path="proceso/:id" element={ <ProcesoPage /> } />
        <Route path="mapa" element={ <MapaPage /> } />
        <Route path="reportes" element={ <ReportePage /> } />
        <Route path="equipo" element={ <EquipoPage /> } />
        <Route path="config" element={ <ConfiguracionesPage /> } />
        <Route path="config/procesos" element={ <ProcesosConfig /> } />
        <Route path="config/usuarios" element={ <UsuariosConfig /> } />
        <Route path="config/reportes" element={ <ReportesConfig /> } />
        <Route path="config/mapa" element={ <MapaConfig /> } />
        <Route path="config/owners" element={ <OwnersConfig /> } />
        <Route path="perfil" element={ <PerfilUser /> } />





      </Route>

    </Routes>


  );
};
