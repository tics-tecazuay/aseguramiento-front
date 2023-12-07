import { Subcriterio } from "./Subcriterio";

export class Indicador{
    id_indicador: number=0;
    nombre:string="";
    descripcion:string="";
    peso:number=0;
    tipo:string="";
    estandar:number=0;
    valor_obtenido:number=0;
    porc_obtenido:number=0;
    porc_utilida_obtenida:number=0;
    subcriterio: Subcriterio | null = null;
    visible:boolean = true;
}