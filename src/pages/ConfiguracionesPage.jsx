import { IconCurrentLocation, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdOutlineNumbers } from 'react-icons/md';
import { Link } from 'react-router';

export const ConfiguracionesPage = () => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Link to="/configuraciones/procesos">
        <Card className="@container/card mt-5">
          <CardHeader>

            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              Procesos
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <MdOutlineNumbers />
                96
              </Badge>

            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Maestro de procesos <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Cree, edite y elimine procesos
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
};