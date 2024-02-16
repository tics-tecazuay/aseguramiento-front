import { Injectable } from '@angular/core';
import { Ponderacion } from '../models/Ponderacion';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, Observable, catchError } from "rxjs";
import baserUrl from './helper';
import { PonderacionProjection } from '../interface/PonderacionProjection';

@Injectable({
  providedIn: 'root'
})
export class PonderacionService {

  constructor(private http: HttpClient) { }
  guardarPonderacion(ponderacion: Ponderacion): Observable<Ponderacion> {
    return this.http.post<Ponderacion>(`${baserUrl}/api/ponderacion/crear`, ponderacion);
  }
  guardarPonderacionLista(ponderaciones: Ponderacion[]): Observable<Ponderacion[]> {
    return this.http.post<Ponderacion[]>(`${baserUrl}/api/ponderacion/crearLista`, ponderaciones);
  }
  listarPonderacion(): Observable<Ponderacion[]> {
    return this.http
      .get(`${baserUrl}/api/ponderacion/listar`)
      .pipe(map((response) => response as Ponderacion[]));
  } 
  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/ponderacion/actualizar/${id}`, crite);
  }
  listarPonderacionPorModelo(id_modelo: number): Observable<Ponderacion[]> {
    return this.http.get<Ponderacion[]>(`${baserUrl}/api/ponderacion/listarPonderacionPorModelo/${id_modelo}`);
  }
  idmax(id_modelo: number): Observable<PonderacionProjection[]> {
    return this.http.get<PonderacionProjection[]>(`${baserUrl}/api/ponderacion/idmax/${id_modelo}`);
  }
  listarPonderacionPorFecha(fecha: string,contador:number): Observable<Ponderacion[]> {
    return this.http.get<Ponderacion[]>(`${baserUrl}/api/ponderacion/listarPonderacionPorFecha/${fecha}/${contador}`);
  }
  getEliminar(contador: number,fecha:string): Observable<Ponderacion> {
    return this.http.delete<Ponderacion>(`${baserUrl}/api/ponderacion/eliminarponderacion/${contador}/${fecha}`);
  }
}
