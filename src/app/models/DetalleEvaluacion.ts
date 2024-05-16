import { Usuario2 } from './Usuario2';
import { Evidencia } from './Evidencia';

export class detalleEvaluacion {
  id_detalle_evaluacion: number = 0;
  estado: boolean = true;
  observacion: string = '';
  fecha: Date = new Date();
  visible: boolean = true;
  usuario: Usuario2 = new Usuario2();
  evidencia: Evidencia = new Evidencia();
  id_modelo: number = 0;
}
