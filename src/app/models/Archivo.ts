import { Actividades } from "./actividades";


export class Archivo {
  id_archivo: number = 0;
  enlace: string = "";
  nombre: string = "";
  descripcion: string = "";
 actividad:Actividades|null=null;

  visible: string = "";
 // indicador:Indicador | null = null;
}

