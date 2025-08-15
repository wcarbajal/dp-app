import { ViewPdf } from '@/components/pdf-view/ViewPdf';

export const IndicadoresProceso = () => {
  return (
    <div>
      <h3>Indicadores del Proceso</h3>
      {/* <pre>{ JSON.stringify( proceso, null, 2 ) }</pre> */}

      <ViewPdf />
    </div>
  );
}