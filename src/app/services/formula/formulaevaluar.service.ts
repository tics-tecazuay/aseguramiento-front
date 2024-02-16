import { Injectable } from '@angular/core';
import { FormulaService } from '../formula.service';
import { EvaluarCuantitativaService } from '../evaluar-cuantitativa.service';
import { EncabezadoEvaluarService } from '../encabezado-evaluar.service';
import { Encabezado_Evaluar } from 'src/app/models/Encabezado-Evaluar';
import { Formulas } from 'src/app/models/Formulas';
import { Evaluar_Cuantitativa } from 'src/app/models/Evaluar-Cuantitativa';

@Injectable({
  providedIn: 'root'
})
export class FormulaEvaluarService {

  constructor(
    private formulaService: FormulaService,
    private evaluarCuantitativaService: EvaluarCuantitativaService,
    private encabezadoEvaluarService: EncabezadoEvaluarService
  ) { }

  async evaluateEquation(idEncabezadoEvaluar: number): Promise<number> {
    const encabezadoEvaluar: any = await this.encabezadoEvaluarService.searchEncabezado_Evaluar(idEncabezadoEvaluar).toPromise();
    if (!encabezadoEvaluar.formula) {
      throw new Error(`Encabezado Evaluar con ID ${idEncabezadoEvaluar} no tiene fórmula asignada.`);
    }
    const formula: any = await this.formulaService.searchFormula(encabezadoEvaluar.formula.id_formula).toPromise();
    let cuantitativas: any[] = await new Promise((resolve, reject) => {
      this.evaluarCuantitativaService.getEvaluar_Cuantitativas().subscribe(
        (data: any) => {
          const cuantitativas = data.filter((evaluacion_cuantitativa: Evaluar_Cuantitativa) => evaluacion_cuantitativa.encabezado_evaluar?.id_encabezado_evaluar === encabezadoEvaluar.id_encabezado_evaluar);
          resolve(cuantitativas);
        },
        (error: any) => {
          console.error('Error al listar las formulas cuantitativas', error);
          reject(error);
        }
      );
    });
    const substitutedEquation = formula.formula.replace(/([a-zA-Z]+)/g, (match:any, letter:any) => {
      const evaluarCuant = cuantitativas.find((ec) => ec.cuantitativa?.abreviatura === letter);
      if (!evaluarCuant) {
        throw new Error(`Unknown letter ${letter} in equation`);
      }
      return evaluarCuant.valor.toString();
    });
    return eval(substitutedEquation);
  }
}