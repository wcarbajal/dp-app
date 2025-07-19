import { Route, Routes } from 'react-router';

import { ProcesoPage } from '@/pages/ProcesoPage';
import { PrincipalPage } from '@/pages/Principal';
import { SectionCards } from '@/components/section-cards';
import { ReportePage } from '@/pages/ReportePage';

import { EquipoPage } from '@/pages/EquipoPage';
import { MapaPage } from '@/pages/MapaPage';


export const PrincipalRouter = () => {
  return (

    <Routes >
      <Route path="/" element={ <PrincipalPage /> } >
        <Route index element={ <SectionCards /> } />
        <Route path="procesos" element={ <ProcesoPage /> } />
        <Route path="mapa" element={ <MapaPage /> } />
        <Route path="reportes" element={ <ReportePage /> } />
        <Route path="equipo" element={ <EquipoPage /> } />


      </Route>

    </Routes>


  );
};