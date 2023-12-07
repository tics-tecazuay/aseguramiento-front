import { Injectable } from '@angular/core';
import { map, Observable, catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import baserUrl from './helper';
import { Evaluar_Cuantitativa } from '../models/Evaluar-Cuantitativa';

@Injectable({
  providedIn: 'root'
})
export class EvaluarCuantitativaService {

  constructor(private http: HttpClient) { }

  getEvaluar_Cuantitativas(): Observable<Evaluar_Cuantitativa[]> {
    return this.http.get<Evaluar_Cuantitativa[]>(`${baserUrl}/api/evaluar_cuantitativa/listarv`);
  }
  crear(r: Evaluar_Cuantitativa): Observable<Evaluar_Cuantitativa> {
    return this.http.post<Evaluar_Cuantitativa>(`${baserUrl}/api/evaluar_cuantitativa/crear`, r
    );
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/evaluar_cuantitativa/actualizar/${id}`, crite);
  }

  eliminar(crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/evaluar_cuantitativa/eliminarlogic/${crite.id_evaluar_cuantitativa}`, crite);
  }

  public listarEvaluarCuantitativaPorIndicador(id: any): Observable<Evaluar_Cuantitativa[]> {
    return this.http
      .get(`${baserUrl}/api/evaluar_cuantitativa/listarPorEncabezado/${id}`)
      .pipe(map((response) => response as Evaluar_Cuantitativa[]));
  }

}
