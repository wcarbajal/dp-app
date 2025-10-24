import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Adjustments } from "tabler-icons-react";
import { Link } from "react-router";

export const ResultadosIndicador = ({ indicador }) => {
  return (
    <Link
      to={`/indicador/${indicador.id}/resultados`}
      state={{ 
        from: 'proceso', 
        indicador: indicador,
        procesoId: indicador.procesoId 
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="default" className="flex items-center gap-2">
            <Adjustments color="white" />
            <span>Gestionar resultados</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Gestionar resultados del indicador</p>
        </TooltipContent>
      </Tooltip>
    </Link>
  );
};