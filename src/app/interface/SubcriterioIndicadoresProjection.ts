export interface SubcriterioIndicadoresProjection {
    id_subcriterio: number;
    nombre: string;
    descripcion: string;
    visible: boolean;
    cantidadIndicadores: number; // El tipo debe coincidir con el tipo COUNT(s) en la consulta SQL
  }