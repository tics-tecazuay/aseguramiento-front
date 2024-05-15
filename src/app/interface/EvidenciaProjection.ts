export interface EvidenciaProjection {
    id_evidencia: number;
    criterio: string;
    subcriterio: string;
    indicador: string;
    estado: string;
    descripcion: string;
    [key: string]: any
    id_asignacion_evidencia: number;
    countarchivos: number;

}