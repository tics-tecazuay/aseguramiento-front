import { Evidencia } from 'src/app/models/Evidencia';
import { Usuario2 } from './Usuario2';
export class Actividades {
    id_actividad!: number;
    nombre!: string;
    estado!: string;
    descripcion!: string;
    fecha_inicio!: string;
    fecha_fin!: string;
   evidencia:Evidencia|null=null;
   usuario:Usuario2|null=null;

}
