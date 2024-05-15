export interface EvidenciasProjection {
    idev: number,
    enca: string,
    crit: string,
    subc: string,
    indic: string,
    descr: string,
}


export interface EvidenciaEvProjection {
    id_evidencia: number;
    nombrecriterio: string;
    nombresubcriterio: string;
    nombreindicador: string;
    tipo: string;
    descripcionevidencia: string;
    estado: string;
    comentario: string;
}
