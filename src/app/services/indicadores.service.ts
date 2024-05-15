import { map, Observable, catchError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Indicador } from '../models/Indicador';
import { HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { HttpParams } from '@angular/common/http';
import { IndicadorEvidenciasProjection } from '../interface/IndicadorEvidenciasProjection';
import { Archivo } from '../models/Archivo';
import { IndiColProjection } from '../interface/IndiColProjection';
import { IndicadorResp } from '../interface/IndicadorResp';
import { IndicadorProjection } from '../interface/IndicadorProjection';
import { IndicadorPorcProjection } from '../interface/IndicadorPorcProjection';
import { PonderacionProjection } from '../interface/PonderacionProjection';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  constructor(private http: HttpClient) { }

  listarIndicador(): Observable<Indicador[]> {
    return this.http
      .get(`${baserUrl}/api/indicadores/listar`)
      .pipe(map((response) => response as Indicador[]));
  }
  getIndicadors(): Observable<Indicador[]> {
    return this.http.get<Indicador[]>(`${baserUrl}/api/indicadores/listar`);
  }
  crear(r: Indicador): Observable<Indicador> {
    return this.http.post<Indicador>(`${baserUrl}/api/indicadores/crear`, r).pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }
  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/indicadores/actualizar/${id}`, crite);
  }
  eliminar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/indicadores/eliminar/${id}`, crite);
  }
  //listar indicadores por subcriterio
  listarIndicadorPorSubcriterio(id: any): Observable<Indicador[]> {
    return this.http
      .get(`${baserUrl}/api/indicadores/listarPorSubcriterio/${id}`)
      .pipe(map((response) => response as Indicador[]));
  }
  //consumir servicio de back @GetMapping("/listarIndicadorPorCriterioModelo/{id_criterio}/{id_modelo}")
  listarIndicadorPorCriterioModelo(id_criterio: any, id_modelo: any): Observable<Indicador[]> {
    return this.http
      .get(`${baserUrl}/api/indicadores/listarIndicadorPorCriterioModelo/${id_criterio}/${id_modelo}`)
      .pipe(map((response) => response as Indicador[]));
  }
  indicadoresPorCriterios(id_modelo: number,ids: number[]): Observable<IndicadorProjection[]> {
    const params = new HttpParams().set('idCriterios', ids.join(','));
    const options = {
      params: params,
      responseType: 'json' as const
    };
    return this.http.get<IndicadorProjection[]>(`${baserUrl}/api/indicadores/indicadoresPorCriterios/${id_modelo}`, options);
  }
  indicadoresPorCriteriosPruebaAlvCL(ids: number[], id_modelo: number): Observable<IndicadorProjection[]> {
    const params = new HttpParams().set('idCriterios', ids.join(','));
    const options = {
      params: params,
      responseType: 'json' as const
    };
    return this.http.get<IndicadorProjection[]>(`${baserUrl}/api/indicadores/indicadoresPorCriteriosPruebaCualitativa/${id_modelo}`, options);
  }
  indicadoresPorCriteriosPruebaAlvCT(ids: number[], id_modelo: number): Observable<IndicadorProjection[]> {
    const params = new HttpParams().set('idCriterios', ids.join(','));
    const options = {
      params: params,
      responseType: 'json' as const
    };
    return this.http.get<IndicadorProjection[]>(`${baserUrl}/api/indicadores/indicadoresPorCriteriosPruebaCuantitativa/${id_modelo}`, options);
  }
  ponderarIndicador(id: any, indicador: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/indicadores/ponderacion/${id}`, indicador);
  }
  getIndicadores(): Observable<Indicador[]> {
    return this.http.get<Indicador[]>(`${baserUrl}/api/indicadores/listar`);
  }
  getIndicadoresModelo(id_modelo:number): Observable<PonderacionProjection[]> {
    return this.http.get<PonderacionProjection[]>(`${baserUrl}/api/indicadores/listarindicadoresModelo/${id_modelo}`);
  }
  getSubcrindica(id_subcriterio:number,id_modelo:number): Observable<IndicadorResp[]> {
    return this.http.get<IndicadorResp[]>(`${baserUrl}/api/indicadores/subcritindicador/${id_subcriterio}/${id_modelo}`);
  }
  getIndicadorById(id_indicador: number): Observable<Indicador> {
    return this.http.get<Indicador>(`${baserUrl}/api/indicadores/buscar/${id_indicador}`);
  }
  obtenerDatosIndicadores(id_subcriterio: any, id_modelo:number): Observable<IndicadorEvidenciasProjection[]> {
    return this.http.get<IndicadorEvidenciasProjection[]>(`${baserUrl}/api/indicadores/datosIndicadores/${id_subcriterio}/${id_modelo}`);
  }
  //consumir servicio de back @GetMapping("/listarIndicadorPorCriterioModelo/{id_criterio}")
  recoverPdfLink(id_criterio: number): Observable<string> {
    return this.http
      .get(`${baserUrl}/archivo/recoverPdf/${id_criterio}`)
      .pipe(map((response) => response as string));
  }
  getarchivorecoverPdf(id_indicador: number): Observable<Archivo[]> {
    return this.http.get<Archivo[]>(`${baserUrl}/archivo/recoverPdf/${id_indicador}`);
  }
  getIndicadorPorModelo(id_modelo: number): Observable<Indicador[]> {
    return this.http.get<Indicador[]>(`${baserUrl}/api/indicadores/indicadorespormodelo/${id_modelo}`);
  }
  getIndicadorColProjection(id_modelo: number): Observable<IndiColProjection[]> {
    return this.http.get<IndiColProjection[]>(`${baserUrl}/api/indicadores/indicadorval/${id_modelo}`);
  }
  getIndicAdmin(id_modelo: number,id:number): Observable<IndiColProjection[]> {
    return this.http.get<IndiColProjection[]>(`${baserUrl}/api/indicadores/indicvaladmin/${id_modelo}/${id}`);
  }
  getvaloresporcIndicadores(sub_nombre:string, id_modelo: number): Observable<IndicadorPorcProjection[]> {
    return this.http.get<IndicadorPorcProjection[]>(`${baserUrl}/api/indicadores/listarporcindicadores/${sub_nombre}/${id_modelo}`);
  }
}
