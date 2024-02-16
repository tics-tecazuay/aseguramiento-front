import { Asigna_Evi } from "./Asignacion-Evidencia";
import { Usuario2 } from "./Usuario2";
import { Actividades } from "./actividades";


export class Observacion2{
    id_observacion:number=0;
    observacion:string="";
    usuario: Usuario2 = new Usuario2();
    actividad: Asigna_Evi = new Asigna_Evi();

}