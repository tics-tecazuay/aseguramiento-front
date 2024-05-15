import { Injectable } from '@angular/core';
import { detalleEvaluacion } from '../models/DetalleEvaluacion';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import baserUrl from './helper';
import { DetalleEvaluacionProjection } from '../interface/DetalleEvaluacionProjection';

@Injectable({
  providedIn: 'root'
})
export class DetalleEvaluacionService {


  constructor(private http: HttpClient) { }
  //Metodo para crear
  create(r: detalleEvaluacion): Observable<detalleEvaluacion> {
    return this.http.post<detalleEvaluacion>(`${baserUrl}/api/detalle_evaluacion/crear`, r).pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }

  //Rol Autoridad - Listar detalle evaluacion
  detalleevaluacion(idEvi: number, idModelo: number): Observable<DetalleEvaluacionProjection[]> {
    return this.http.get<DetalleEvaluacionProjection[]>(`${baserUrl}/api/detalle_evaluacion/listarporEvidencia/${idEvi}/${idModelo}`)
      .pipe(
        catchError(error => {
          console.log('Error:', error);
          return throwError('Hubo un error al obtener los detalles de evaluación');
        })
      );
  }

  //Metodo para listar
  getDetalleEvi(idEvi: number, idModelo: number): Observable<detalleEvaluacion[]> {
    return this.http.get<detalleEvaluacion[]>(`${baserUrl}/api/detalle_evaluacion/listarporEviRecha/${idEvi}/${idModelo}`)
      .pipe(
        catchError(error => {
          console.log('Error:', error);
          return throwError('Hubo un error al obtener los detalles de evaluación');
        })
      );
  }
  //Metodo para listar Aprobadas
  getDetalleEviApro(idEvi: number, idUsua: number,): Observable<detalleEvaluacion[]> {
    return this.http.get<detalleEvaluacion[]>(`${baserUrl}/api/detalle_evaluacion/listarporEviApro/${idEvi}/${idUsua}`)
      .pipe(
        catchError(error => {
          console.log('Error:', error);
          return throwError('Hubo un error al obtener los detalles de evaluación');
        })
      );
  }
  //Metodo para eliminar

  eliminar(detalle: number): Observable<any> {
    console.log(detalle)
    return this.http.put(`${baserUrl}/api/detalle_evaluacion/eliminarlogic/${detalle}`, detalle);

  }
  //Metodo para editar
  actualizar(id: any, detalle: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/detalle_evaluacion/actualizar/${id}`, detalle);
  }
  public getObservaciones(id_evidencia: number, id_modelo: number): Observable<detalleEvaluacion[]> {
    return this.http.get<detalleEvaluacion[]>(`${baserUrl}/api/detalle_evaluacion/observaciones/${id_evidencia}/${id_modelo}`);

  }

}
