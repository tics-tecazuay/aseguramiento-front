export interface PonderacionProjection{
    contador:number;
    fechapo: Date;
    maxcontador:number;

    //Ponderacion Modelo
    idponderacion: number;
    idindicador: number;
    nombrecriterio: string;
    nombresubcriterio: string;
    nombreindicador: string;
    valorobtenido: number;
    porcentajeobtenido: number;
    porcentajeutilidad: number;
    peso: number;
    color: string;
}