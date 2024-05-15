import { Asigna_Evi } from "./Asignacion-Evidencia";
import { Actividades } from "./actividades";


export class Archivo {
  id_archivo: number = 0;
  enlace: string = "";
  nombre: string = "";
  descripcion: string = "";
  actividad: Asigna_Evi | null = null;
  visible: string = "";
}
export interface ArchivoProjectionRes {
  id_archivo: number;
  enlace: string;
  nombre: string;
  descripcion: string;
  comentario: string;
}

export interface ArchivoAdmSupProjection {
  id_archivo: number;
  enlace: string;
  nombre: string;
  descripcion: string;
  comentario: string;
}