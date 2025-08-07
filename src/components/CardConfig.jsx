import { Link } from 'react-router';
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MdOutlineNumbers } from 'react-icons/md';
import { IconTrendingUp } from '@tabler/icons-react';
import { capitalize } from '@/utils/text';

// Función para capitalizar la primera letra


export const CardConfig = ({ ruta, objeto, cantidad, icon }) => {

  
  return (
    <Link to={ruta}>
        <Card className="@container/card mt-5">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {capitalize(objeto)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {icon ? icon : <MdOutlineNumbers className="size-4" />}
                {cantidad}
              </Badge>

            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Maestro de {objeto} <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Cree, edite y elimine {objeto.toLowerCase()}
            </div>
          </CardFooter>
        </Card>
      </Link>
  )
}