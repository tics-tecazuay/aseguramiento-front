import { map, Observable, catchError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Subcriterio, SubcriterioPDTO } from '../models/Subcriterio';
import { HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { SubcriterioIndicadoresProjection } from '../interface/SubcriterioIndicadoresProjection';
import { SubcriterioIndicadoresProjectionFull } from '../interface/SubcriterioIndicadoresProjectionFull';
import { IndicadorProjection } from '../interface/IndicadorProjection';
import { SubcriterioPorcProjection } from '../interface/SubcriterioPorcProjection';


@Injectable({
  providedIn: 'root'
})
export class SubcriteriosService {

  constructor(private http: HttpClient) { }
  getSubcriterios(): Observable<Subcriterio[]> {
    return this.http.get<Subcriterio[]>(`${baserUrl}/api/subcriterio/listar`);
  }
  getSubcritIndi(id_criterio: number, id_modelo: number): Observable<SubcriterioIndicadoresProjection[]> {
    return this.http.get<SubcriterioIndicadoresProjection[]>(`${baserUrl}/api/subcriterio/subcritindi/${id_criterio}/${id_modelo}`);
  }

  crearSubcriterio(r: SubcriterioPDTO): Observable<SubcriterioPDTO> {
    return this.http.post<SubcriterioPDTO>(`${baserUrl}/api/subcriterio/crear`, r).pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }

  listarSubcriterio(): Observable<Subcriterio[]> {
    return this.http
      .get(`${baserUrl}/api/subcriterio/listar`)
      .pipe(map((response) => response as Subcriterio[]));
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/subcriterio/actualizar/${id}`, crite);
  }

  eliminar(crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/subcriterio/eliminar/${crite.id_subcriterio}`, crite);
  }
  //listar subcriterios por criterio
  listarSubcriterioPorCriterio(id: any): Observable<Subcriterio[]> {
    return this.http
      .get(`${baserUrl}/api/subcriterio/listarPorCriterio/${id}`)
      .pipe(map((response) => response as Subcriterio[]));
  }
  obtenerDatosCriterios(id_criterio: any, id_modelo: number): Observable<SubcriterioIndicadoresProjection[]> {
    return this.http.get<SubcriterioIndicadoresProjection[]>(`${baserUrl}/api/subcriterio/datosSubcriterios/${id_criterio}/${id_modelo}`);
  }
  obtenerDatosSubcriteriosFull(): Observable<SubcriterioIndicadoresProjectionFull[]> {
    return this.http.get<SubcriterioIndicadoresProjectionFull[]>(`${baserUrl}/api/subcriterio/datosSubcriteriosFull`);
  }
  getvaloresporcSubcriterios(cri_nombre: string, id_modelo: number): Observable<SubcriterioPorcProjection[]> {
    return this.http.get<SubcriterioPorcProjection[]>(`${baserUrl}/api/subcriterio/listarporcsubcriterios/${cri_nombre}/${id_modelo}`);
  }
}
