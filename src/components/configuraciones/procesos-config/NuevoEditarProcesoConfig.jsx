import { Button } from "@/components/ui/button";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MdOutlineExposurePlus1 } from "react-icons/md";

import { FormProcesoConfig } from './FormProcesoConfig';

export const NuevoEditarProcesoConfig = ( { openDialog, setOpenDialog, form, handleSubmit, procesos, editId, setEditId } ) => {
  return (
    <Dialog open={ openDialog } onOpenChange={ setOpenDialog }>
      <DialogTrigger asChild>
        <Button onClick={ () => {
          form.setValue( "codigo", "" );
          form.setValue( "nombre", "" );
          form.setValue( "descripcion", "" );
          form.setValue( "nivel", "" );
          form.setValue( "tipo", "" );
          form.setValue( "parentId", undefined );
          setOpenDialog( true );
          setEditId( null );
        } }
        >
          <MdOutlineExposurePlus1 />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle className="text-lg font-boldt text-center">{ editId ? "Editar Proceso" : "Nuevo Proceso" }</DialogTitle>
          <DialogDescription id="dialog-description">
            Complete los datos para crear o editar un proceso.
          </DialogDescription>
        </DialogHeader>

        <FormProcesoConfig  handleSubmit={ handleSubmit } procesos={ procesos } editId={ editId } />

      </DialogContent>
    </Dialog>

  );
};