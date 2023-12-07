export class AutoIndicador{
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

interface Subcriterio{
    id_subcriterio: number ;
    nombre: string ;
    descripcion: string ;
    criterio: Criterio ;
    visible: boolean;
}

interface Criterio{
    id_criterio: number ;
    nombre: string ;
    descripcion: string ;
    visible: boolean;
}