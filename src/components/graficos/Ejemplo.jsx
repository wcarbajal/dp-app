"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip, YAxis, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart with a custom label";

export function Ejemplo( { titulo = "", subtitulo = "", data, variables } ) {

  if ( !data || data.length === 0 ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{ titulo }</CardTitle>
          <CardDescription>{ subtitulo }</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">No hay datos disponibles</div>
        </CardContent>
      </Card>
    );
  }
  const [ xKey, yKey ] = variables;

  const maxLabelLength = data.reduce(
    ( max, item ) => Math.max( max, String( item[ xKey ] ).length ),
    0
  );
  // Ajusta el ancho base (por ejemplo, 8px por carácter + un margen)
  const yAxisWidth = Math.max( 30, maxLabelLength * 10 );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ titulo }</CardTitle>
        <CardDescription>{ subtitulo }</CardDescription>
      </CardHeader>
      <CardContent style={ { width: "100%", height: 200 } }>
        <ResponsiveContainer >
          <BarChart
            data={ data }
            layout="vertical"
            margin={ { right: 16 } }
          >
            <CartesianGrid horizontal={ false } />
            <YAxis
              dataKey={ xKey }
              type="category"
              tickLine={ false }
              tickMargin={ 10 }
              axisLine={ false }
              width={ yAxisWidth } // Ajusta este valor según el largo de tus textos
            />
            <XAxis
              dataKey={ yKey }
              type="number"
              hide={ false }
            />
            <Tooltip
              labelFormatter={ ( label, payload ) => {
                if ( payload && payload.length > 0 ) {
                  return `${ xKey }: ${ payload[ 0 ].payload[ xKey ] }`;
                }
                return label;
              } }
            />
            <Bar
              dataKey={ yKey }
              layout="vertical"
              fill="var(--color-desktop)"
              radius={ 4 }
            >
              <LabelList
                position="right"
                offset={ 8 }
                className="fill-(--color-label)"
                fontSize={ 12 }                
              />
             
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}