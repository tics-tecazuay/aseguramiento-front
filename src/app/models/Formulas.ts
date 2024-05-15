export class Formulas {
    id_formula: number = 0;
    formula: String = "";
    descripcion: String = "";
    visible: boolean = true;

}

export interface FormulasProjection {
    criterio: string;
    subcriterio: string;
    indicador: string;
    id_formula: number;
    formula: string;
    descripcion: string;
}