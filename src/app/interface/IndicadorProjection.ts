export interface IndicadorProjection{
    nombre: string;
    faltante: number;
    total: number;

    //reporte criterio
    nombrecriterio: string;
    nombresubcriterio: string;
    nombreindicador: string;
    descripcionindicador: string;
    valorobtenido: number;
    porcentajeobtenido: number;
    porcentajeutilidad: number;
    tipo: string;
}