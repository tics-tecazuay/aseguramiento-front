import { Indicador } from './Indicador';

export class CalificarIndicador{
    id_calificar_indicador: number=0;
    valor_obtenido:number=0;
    porc_obtenido:number=0;
    porc_utilida_obtenida:number=0;
    id_modelo: number=0;
    visible:boolean = true;
    indicador: Indicador | null = null;
}