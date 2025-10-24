# Componente ResultadosIndicador

## Descripción
El componente `ResultadosIndicador` es un formulario completo para gestionar los resultados asociados a un indicador. Utiliza React Hook Form para el manejo del formulario, Zod para validación y shadcn/ui para los componentes de interfaz.

## Características
- ✅ Formulario de creación y edición de resultados
- ✅ Validación con Zod
- ✅ Lista de resultados existentes
- ✅ Operaciones CRUD completas
- ✅ Interfaz responsiva
- ✅ Tooltips informativos

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `indicador` | Object | ✅ | Objeto del indicador al que pertenecen los resultados |
| `resultados` | Array | ❌ | Array de resultados existentes (default: []) |
| `onSave` | Function | ✅ | Función para guardar/actualizar un resultado |
| `onDelete` | Function | ✅ | Función para eliminar un resultado |

## Estructura del modelo Resultado (Prisma)

```prisma
model Resultado {
  id            Int      @id @default(autoincrement())
  denominacion  String?  // Opcional
  descripcion   String?  // Opcional
  valor         Float    // Requerido
  fechaRegistro DateTime @updatedAt
  indicadorId   Int      // Requerido
  indicador     Indicador @relation(fields: [indicadorId], references: [id])
}
```

## Schema de Validación

```javascript
const resultadoSchema = z.object({
  denominacion: z.string().optional(),
  descripcion: z.string().optional(),
  valor: z
    .string()
    .min(1, "El valor es requerido")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "Debe ser un número válido"),
  fechaRegistro: z.string().min(1, "La fecha de registro es requerida"),
});
```

## Ejemplo de uso

```jsx
import { ResultadosIndicador } from './ResultadosIndicador';

// En tu componente padre
const MiComponente = () => {
  const [indicador, setIndicador] = useState(miIndicador);

  const handleSaveResultado = async (resultadoData) => {
    try {
      const method = resultadoData.id ? 'PUT' : 'POST';
      const endpoint = resultadoData.id 
        ? `resultado/${resultadoData.id}` 
        : 'resultado';
      
      const response = await fetchConToken(endpoint, resultadoData, method);
      
      if (response.ok) {
        // Mostrar mensaje de éxito
        // Recargar datos si es necesario
      }
    } catch (error) {
      // Manejar error
    }
  };

  const handleDeleteResultado = async (resultadoId) => {
    try {
      const response = await fetchConToken(`resultado/${resultadoId}`, {}, 'DELETE');
      
      if (response.ok) {
        // Mostrar mensaje de éxito
        // Recargar datos si es necesario
      }
    } catch (error) {
      // Manejar error
    }
  };

  return (
    <div>
      <ResultadosIndicador 
        indicador={indicador}
        resultados={indicador.resultado || []}
        onSave={handleSaveResultado}
        onDelete={handleDeleteResultado}
      />
    </div>
  );
};
```

## Endpoints de API requeridos

El componente espera que existan los siguientes endpoints en tu backend:

### Crear resultado
```
POST /resultado
Body: {
  denominacion?: string,
  descripcion?: string,
  valor: number,
  fechaRegistro: string (ISO Date),
  indicadorId: number
}
```

### Actualizar resultado
```
PUT /resultado/:id
Body: {
  denominacion?: string,
  descripcion?: string,
  valor: number,
  fechaRegistro: string (ISO Date)
}
```

### Eliminar resultado
```
DELETE /resultado/:id
```

### Obtener resultados de un indicador
```
GET /indicador/:indicadorId/resultados
```

## Campos del formulario

1. **Denominación** (opcional)
   - Tipo: Text
   - Descripción: Nombre o título descriptivo del resultado

2. **Valor** (requerido)
   - Tipo: Number
   - Descripción: Valor numérico del resultado
   - Validación: Debe ser un número válido

3. **Fecha de Registro** (requerido)
   - Tipo: Date
   - Descripción: Fecha en la que se registra el resultado
   - Default: Fecha actual

4. **Descripción** (opcional)
   - Tipo: Textarea
   - Descripción: Descripción detallada del resultado

## Funcionalidades

### Crear nuevo resultado
- Click en "Gestionar resultados"
- Llenar el formulario
- Click en "Guardar Resultado"

### Editar resultado existente
- Click en "Editar" en la lista de resultados
- Modificar los campos necesarios
- Click en "Actualizar Resultado"

### Eliminar resultado
- Click en el ícono de papelera en la lista de resultados
- Confirmar la eliminación

### Limpiar formulario
- Click en "Limpiar" para resetear todos los campos

## Dependencias

```json
{
  "react-hook-form": "^7.60.0",
  "@hookform/resolvers": "^5.1.1",
  "zod": "^4.0.5",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-tooltip": "^1.2.7"
}
```

## Notas de implementación

1. El componente usa `AlertDialog` para mostrar el formulario en un modal
2. Los resultados se muestran en una lista debajo del formulario
3. La validación se realiza en tiempo real
4. Los mensajes de éxito/error se muestran usando SweetAlert2
5. El formulario se resetea automáticamente después de guardar
6. Todos los campos opcionales pueden estar vacíos
7. El `indicadorId` se pasa automáticamente al guardar