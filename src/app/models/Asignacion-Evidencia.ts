import { Usuario2 } from './Usuario2';
import { Evidencia } from './Evidencia';

export class Asigna_Evi {
  id_asignacion_evidencia: number = 0;
  evidencia: Evidencia = new Evidencia();
  usuario: Usuario2 = new Usuario2();
  usuario2: Usuario2 | null = null;
  visible: boolean = true;
  id_modelo: number = 0;
  estado: string = '';
  fecha_inicio!: Date;
  fecha_fin!: Date;
  id_usuario_asignador!: number;
  archsubido!: boolean;
}

export interface ActividadesCalendar {
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface AsignaEvidenciaParamss {
  evidencia_id: number;
  id_modelo: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  usuario_id: number;
  id_usuario_asignador: number;
  nombreasignado: string;
}
