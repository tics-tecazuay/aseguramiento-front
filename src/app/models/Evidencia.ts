
import { Indicador } from "./Indicador";

export class Evidencia {
    id_evidencia: number = 0;
    enlace: string = "";
    nombre: string = "";
    descripcion: string = "";
    visible: string = "";
    estado: string = "";
    indicador:Indicador = new Indicador();
}

export interface ActiDiagramaPieProjection {
    pendientes: number;
    aprobados: number;
    rechazados: number;
    total: number;
    porcentaje_pendientes: number;
    porcentaje_aprobados: number;
    porcentaje_rechazados: number;

}

