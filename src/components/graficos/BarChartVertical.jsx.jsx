import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip, YAxis, ResponsiveContainer, Legend } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



//export const description = "A bar chart with a custom label";

export const BarChartVertical = ( { titulo = "", subtitulo = "", data, variables } ) => {

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
  const [ etiqueta, _ ] = variables;


  return (
    <Card>
      <CardHeader>
        <CardTitle>{ titulo }</CardTitle>
        <CardDescription>{ subtitulo }</CardDescription>
      </CardHeader>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={ 500 }
          height={ 300 }
          data={ data }
          margin={ {
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          } }
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={ etiqueta } />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="cantidad"
            fill="var(--color-desktop)"
          >

            <LabelList
              position="top"
              offset={ 8 }
              className="fill-(--color-label)"
              fontSize={ 12 }
            />
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}