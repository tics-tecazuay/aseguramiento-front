export interface IndicadorEvidenciasProjectionFull {
    id_indicador: number;
    nombre: string;
    criterio: string;
    subcriterio: string;
    evidencia: string;
    descripcion: string;
    peso: number;
    estandar: number;
    tipo:string;
    valor_obtenido: number;
    porc_obtenido: number;
    porc_utilida_obtenida: number;
    visible: boolean;
    cantidadEvidencia: number; // El tipo debe coincidir con el tipo COUNT(s) en la consulta SQL
    nombreCriterio: string;
}