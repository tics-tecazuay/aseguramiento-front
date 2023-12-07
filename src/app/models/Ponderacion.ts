import { Indicador } from "./Indicador";
import { Modelo } from "./Modelo";

export class Ponderacion {
    id_ponderacion !:number;
    fecha!:Date;
    peso: number =0;
    porc_obtenido : number=0;
    porc_utilida_obtenida:number=0;
    valor_obtenido :number=0;
    visible:boolean=true;
    indicador: Indicador | null = null;
    modelo : Modelo| null = null;
    contador:number=0;
}
