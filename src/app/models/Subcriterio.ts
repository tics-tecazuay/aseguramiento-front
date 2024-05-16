import { number } from "mathjs";
import { Criterio } from "./Criterio";

export class Subcriterio {
    id_subcriterio: number = 0;
    nombre: string = "";
    descripcion: string = "";
    criterio: Criterio | null = null;
    visible: boolean = true;
}

export interface SubcriterioPDTO {
    nombre: string;
    descripcion: string;
    id_criterio: number;
}