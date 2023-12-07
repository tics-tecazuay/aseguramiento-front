import { map, Observable, catchError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Indicador } from '../models/Indicador';
import { HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { IndicadorEvidenciasProjection } from '../interface/IndicadorEvidenciasProjection';
import { Archivo } from '../models/Archivo';

import { IndicadorEvidenciasProjectionFull } from '../interface/IndicadorEvidenciasProjectionFull';
import { IndiColProjection } from '../interface/IndiColProjection';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  private apiUrl = 'URL_DEL_BACKEND'; // Reemplaza 'URL_DEL_BACKEND' con la URL correcta de tu backend

  constructor(private http: HttpClient) { }

  public listarIndicador(): Observable<Indicador[]> {
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
        // console.error(error);
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
  public listarIndicadorPorSubcriterio(id: any): Observable<Indicador[]> {
    return this.http
      .get(`${baserUrl}/api/indicadores/listarPorSubcriterio/${id}`)
      .pipe(map((response) => response as Indicador[]));
  }


  //consumir servicio de back @GetMapping("/listarIndicadorPorCriterioModelo/{id_criterio}/{id_modelo}")
  public listarIndicadorPorCriterioModelo(id_criterio: any, id_modelo: any): Observable<Indicador[]> {
    return this.http
      .get(`${baserUrl}/api/indicadores/listarIndicadorPorCriterioModelo/${id_criterio}/${id_modelo}`)
      .pipe(map((response) => response as Indicador[]));
  }



  obtenerEnlaceArchivoPorIndicador(id_indicador: any, nombre_indicador: string): Observable<string> {
    // Realizar la consulta SQL en el backend para obtener el enlace del archivo
    return this.http.get<string>(`${this.apiUrl}/api/obtenerEnlaceArchivoPorIndicador?id_indicador=${id_indicador}&nombre_indicador=${nombre_indicador}`);
  }

  // public indicadoresPorCriterios(ids: any): Observable<Indicador[]> {
  //   return this.http.get<Indicador[]>(`${baserUrl}/api/indicadores/indicadoresPorCriterios`, ids );
  // }
  public indicadoresPorCriterios(ids: number[]): Observable<Indicador[]> {
    const params = new HttpParams().set('idCriterios', ids.join(','));
    const options = {
      params: params,
      responseType: 'json' as const
    };
    return this.http.get<Indicador[]>(`${baserUrl}/api/indicadores/indicadoresPorCriterios`, options);
  }

  public indicadoresPorCriteriosPruebaAlvCL(ids: number[]): Observable<Indicador[]> {
    const params = new HttpParams().set('idCriterios', ids.join(','));
    const options = {
      params: params,
      responseType: 'json' as const
    };
    return this.http.get<Indicador[]>(`${baserUrl}/api/indicadores/indicadoresPorCriteriosPruebaCL`, options);
  }
  public indicadoresPorCriteriosPruebaAlvCT(ids: number[]): Observable<Indicador[]> {
    const params = new HttpParams().set('idCriterios', ids.join(','));
    const options = {
      params: params,
      responseType: 'json' as const
    };
    return this.http.get<Indicador[]>(`${baserUrl}/api/indicadores/indicadoresPorCriteriosPruebaCT`, options);
  }


  public ponderarIndicador(id: any, indicador: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/indicadores/ponderacion/${id}`, indicador);
  }

  getIndicadores(): Observable<Indicador[]> {
    return this.http.get<Indicador[]>(`${baserUrl}/api/indicadores/listar`);
  }

  getSubcrindica(id_subcriterio:number,id_modelo:number): Observable<Indicador[]> {
    return this.http.get<Indicador[]>(`${baserUrl}/api/indicadores/subcritindicador/${id_subcriterio}/${id_modelo}`);
  }
  getIndicadorById(id_indicador: number): Observable<Indicador> {
    return this.http.get<Indicador>(`${baserUrl}/api/indicadores/buscar/id_indicador/${id_indicador}`);
  }

  public obtenerIndicadoresPorCriterio(id: any): Observable<Indicador[]> {
    return this.http
      .get(`${baserUrl}/api/indicadores/obtenerIndicadoresPorCriterio/${id}`)
      .pipe(map((response) => response as Indicador[]));
  }
  obtenerDatosIndicadores(id_subcriterio: any): Observable<IndicadorEvidenciasProjection[]> {
    return this.http.get<IndicadorEvidenciasProjection[]>(`${baserUrl}/api/indicadores/datosIndicadores/${id_subcriterio}`);
  }


  //consumir servicio de back @GetMapping("/listarIndicadorPorCriterioModelo/{id_criterio}")
  public recoverPdfLink(id_criterio: number): Observable<string> {
    return this.http
      .get(`${baserUrl}/archivo/recoverPdf/${id_criterio}`)
      .pipe(map((response) => response as string));
  }


  public getarchivorecoverPdf(id_indicador: number): Observable<Archivo[]> {
    return this.http.get<Archivo[]>(`${baserUrl}/archivo/recoverPdf/${id_indicador}`);
  }


  obtenerDatosIndicadoresFull(): Observable<IndicadorEvidenciasProjectionFull[]> {
    return this.http.get<IndicadorEvidenciasProjectionFull[]>(`${baserUrl}/api/indicadores/datosIndicadoresFull`);
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
}
