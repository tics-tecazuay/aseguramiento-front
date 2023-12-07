
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


