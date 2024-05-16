export interface ActividadesProjection{
    nombres: string;
    total: number;
    avance: number;
}

export interface ActividadesCumplidasProjection{
    
    idevidencia: number;
    criterio: string;
    subcriterio: string;
    indicador: string;
    nombre: string;
    fechainicio: string;
    fechafin: string;
    nombreresponsable: string
    estado: string

}

export interface ActividadesUsuarioProjection{
    nombreactividad: string;
    inicio: string;
    fin: string;
}
