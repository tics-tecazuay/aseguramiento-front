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

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }
  //metodo para crear 
  public guardarPonderacion(ponderacion: Ponderacion): Observable<Ponderacion> {
    return this.http.post<Ponderacion>(`${baserUrl}/api/ponderacion/crear`, ponderacion);
  }

  public guardarPonderacionLista(ponderaciones: Ponderacion[]): Observable<Ponderacion[]> {
    return this.http.post<Ponderacion[]>(`${baserUrl}/api/ponderacion/crearLista`, ponderaciones);
  }

  //metodo para listar ponderacion
  public listarPonderacion(): Observable<Ponderacion[]> {
    return this.http
      .get(`${baserUrl}/api/ponderacion/listar`)
      .pipe(map((response) => response as Ponderacion[]));
  } 


  //Listar por Id

  public getPonderacionById(id: number): Observable<Ponderacion> {

    return this.http.get<Ponderacion>(`${baserUrl}/api/ponderacion/buscar/${id}`);
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/ponderacion/actualizar/${id}`, crite);
  }


  public listarPonderacionPorModelo(id_modelo: number): Observable<Ponderacion[]> {
    return this.http.get<Ponderacion[]>(`${baserUrl}/api/ponderacion/listarPonderacionPorModelo/${id_modelo}`);
  }

  public idmax(id_modelo: number): Observable<PonderacionProjection[]> {
    return this.http.get<PonderacionProjection[]>(`${baserUrl}/api/ponderacion/idmax/${id_modelo}`);
  }

  public listarPonderacionModelo(id_modelo: number): Observable<PonderacionProjection[]> {
    return this.http.get<PonderacionProjection[]>(`${baserUrl}/api/ponderacion/listarPonderacionPorModelo/${id_modelo}`);
  }
  public listarPonderacionPorFecha(fecha: string,contador:number): Observable<Ponderacion[]> {
    return this.http.get<Ponderacion[]>(`${baserUrl}/api/ponderacion/listarPonderacionPorFecha/${fecha}/${contador}`);
  }

  //@GetMapping("/listarPorFecha/{fecha}")
  public listarPorFecha(fecha: string): Observable<Ponderacion[]> {
    return this.http.get<Ponderacion[]>(`${baserUrl}/api/ponderacion/listarPorFecha/` + fecha);
  }
  getEliminar(contador: number,fecha:string): Observable<Ponderacion> {
    return this.http.delete<Ponderacion>(`${baserUrl}/api/ponderacion/eliminarponderacion/${contador}/${fecha}`);
  }

}
