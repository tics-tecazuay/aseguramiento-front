export interface ModeloVistaProjection {
  id_modelo: number;
  nombre: string;
  fecha_fin:Date;
  fecha_final_act:Date;
  fecha_inicio:Date;
  nro_indicadores: number; 
  nro_subcriterios: number; 
  nro_criterios: number; // El tipo debe coincidir con el tipo COUNT(s) en la consulta SQL
}