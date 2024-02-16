export interface AsigEvidProjection{
    idev:number;
    idcri:number;
    nombcri:string;
    idsub:string;
    nombsub:string;
    idind:number;
    nombind:string;
    descripc:string;
}

export interface HistorialAsigEvi {
    nombre_usuario: string;
    fecha: Date;
    fecha_fin: Date;
    fecha_inicio: Date;
    estado: string;
    titulo_evidencia: string;
    titulo_indicador: string;
    titulo_subcriterio: string;
    titulo_criterio: string;
}

export interface EvidenciaReApPeAtr{
    responsable: string;
    nombre_criterio: string;
    nombre_subcriterio: string;
    nombre_indicador: string;
    evidencia: string;
    fecha_fin: Date;
    fecha_inicio: Date;
    estado: string;
}