export interface CriteUsuarioProjection{
   
    criterio:string;
    evidencia:string;
    usuariorol:number;
    criterionombre:string;

    //reporte de criterio
    idcriterio: number;
    nombrecriterio: string,
}

export interface CriterioByAdmin{
    id_criterio: number;
    nombre_criterio: string,
    descripcion_criterio: string
}

export interface CriterioCal{
    idcriterio: number;
    nombrecriterio: string,
    descripcio: string
}
