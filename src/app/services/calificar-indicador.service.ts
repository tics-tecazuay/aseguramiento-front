import { CalificarIndicador } from 'src/app/models/CalificarIndicador';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class CalificarIndicadorService {

  constructor(private httpClient: HttpClient) { 

  }
   //GUARDAR CALIFICACION DEL INDICADOR
  crearCalificarIndicador(calificacion: CalificarIndicador): Observable<CalificarIndicador> {
    return this.httpClient.post<CalificarIndicador>(`${baserUrl}/api/calificar_indicador/crear`, calificacion);
  }
  //OBTENER CALIFICACION DE INDICADOR POR INDICADOR Y MODELO
  obtenerCalificacionPorIndicador(id_indicador: number, id_modelo: number): Observable<CalificarIndicador> {
    return this.httpClient.get<CalificarIndicador>(`${baserUrl}/api/calificar_indicador/buscarporindicador/${id_indicador}/${id_modelo}`);
  }
  //ACTUALIZAR CALIFICACION DE INDICADOR
  actualizarCalificacionIndicador(id_calificacion: number, calificacion: CalificarIndicador): Observable<CalificarIndicador> {
    return this.httpClient.put<CalificarIndicador>(`${baserUrl}/api/calificar_indicador/actualizar/${id_calificacion}`, calificacion);
  }
}
