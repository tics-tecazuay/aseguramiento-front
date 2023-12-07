import { Criterio } from "./Criterio";

export class Subcriterio {
    id_subcriterio: number = 0;
    nombre: string = "";
    descripcion: string = "";
    criterio: Criterio | null = null;
    visible: boolean = true;
}