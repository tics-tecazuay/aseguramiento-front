import { Cuantitativa } from "./Cuantitativa";
import { Encabezado_Evaluar } from "./Encabezado-Evaluar";

export class Evaluar_Cuantitativa {
    id_evaluar_cuantitativa: number = 0;
    valor: number = 0;
    visible: boolean = false;
    encabezado_evaluar:Encabezado_Evaluar| null = null;
    cuantitativa: Cuantitativa| null = null;
}