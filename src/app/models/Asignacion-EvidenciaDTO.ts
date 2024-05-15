import { Evidencia } from "./Evidencia";
import { Usuario2 } from "./Usuario2";

export class Asigna_EviDTO {
  id_asignacion_evidencia: number = 0;
  descripcion_evidencia!: string;
  fecha_inicio!: Date;
  fecha_fin!: Date;
  estado_evidencia!: String;
  observacion!: String;
  evidencia: Evidencia | null = null;
  usuario: Usuario2 | null = null;
  countarchivos!: boolean;
  comentario_archivo!: String;
}
