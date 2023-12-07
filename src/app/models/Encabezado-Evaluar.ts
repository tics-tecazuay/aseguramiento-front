import { Indicador } from './Indicador';
import { Formulas } from "./Formulas";

export class Encabezado_Evaluar{
    id_encabezado_evaluar:number=0;
    visible:boolean=true;
    formula:Formulas| null = null;
    indicador:Indicador| null = null;
}