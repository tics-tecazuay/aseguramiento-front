export interface CriterioSubcriteriosProjection {
  id_criterio: number;
  nombre: string;
  descripcion: string;
  visible: boolean;
  cantidadSubcriterios: number; // El tipo debe coincidir con el tipo COUNT(s) en la consulta SQL
}