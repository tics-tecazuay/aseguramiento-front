import { Injectable } from '@angular/core';
import { Criterio } from '../models/Criterio';
import { map, Observable, catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import baserUrl from './helper';
import { Modelo } from '../models/Modelo';
import { Observacion } from '../models/Observacion';
import { Persona2 } from '../models/Persona2';
import { CriterioSubcriteriosProjection } from '../interface/CriterioSubcriteriosProjection';
import { proyeccionCriterio } from '../pages/admin/aprobar-rechazar-admin/proyecciones-testeo/proyeccionCriterio';
import { IndicadorProjection } from '../interface/IndicadorProjection';
import { ValoresProjection } from '../interface/ValoresProjection';
import { IdCriterioProjection } from '../interface/IdCriterioProjection';
import { CorreoProjection } from '../interface/CorreoProjection';
import { CriteUsuarioProjection, CriterioByAdmin } from '../interface/CriteUsuarioProjection';
import { CriRespProjection } from '../interface/CriteRespProjection';
import { id } from '@swimlane/ngx-charts';
import { CriterioPorcProjection } from '../interface/CriterioPorcProjection';


@Injectable({
  providedIn: 'root'
})
export class CriteriosService {

  constructor(private http: HttpClient) { }
  
  getCriterioById(id: number): Observable<Criterio> {
    return this.http.get<Criterio>(`${baserUrl}/api/criterio/buscar/${id}`);
  }

  getCorreo(id_modelo: number,id_evidencia:number): Observable<CorreoProjection> {
    return this.http.get<CorreoProjection>(`${baserUrl}/api/criterio/correo/${id_modelo}/${id_evidencia}`);
  }

  public listarCriterio(): Observable<Criterio[]> {
    return this.http
      .get(`${baserUrl}/api/criterio/listar`)
      .pipe(map((response) => response as Criterio[]));
  }
  getCriterios(): Observable<Criterio[]> {
    return this.http.get<Criterio[]>(`${baserUrl}/api/criterio/listar`);
  }
  crear(r: Criterio): Observable<Criterio> {
    return this.http.post<Criterio>(`${baserUrl}/api/criterio/crear`, r
    );
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/criterio/actualizar/${id}`, crite);
  }

  eliminar(crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/criterio/eliminar/${crite.id_criterio}`, crite);

  }

  getObtenerCriterio(): Observable<Criterio[]> {
    return this.http.get<Criterio[]>(`${baserUrl}/api/criterio/listarcriteriosMode`);
  }

  getDatos(): Observable<any> {
    return this.http.get<any>(`${baserUrl}/api/criterio/datos`);
  }
  getObtenerCriterio2(id: number): Observable<Criterio[]> {
    return this.http.get<Criterio[]>(`${baserUrl}/api/criterio/listarcriteriosMId/` + id);
  }

  getObtenerIndicadores(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/indicadores/buscarindicador/` + id);
  }

  getIndicador(id_modelo:number): Observable<IndicadorProjection[]> {
    return this.http.get<IndicadorProjection[]>(`${baserUrl}/api/indicadores/listarindi/${id_modelo}`)
  }

  getIndicadorad(id_modelo:number,id_usuario:number): Observable<CriterioPorcProjection[]> {
    return this.http.get<CriterioPorcProjection[]>(`${baserUrl}/api/indicadores/listarindiad/${id_modelo}/${id_usuario}`)
  }
  
  getIndicadorresponsable(id_modelo:number,id:number): Observable<IndicadorProjection[]> {
    return this.http.get<IndicadorProjection[]>(`${baserUrl}/api/indicadores/listarindicadresponsable/${id_modelo}/${id}`)
  }

  getModeMaximo(): Observable<Modelo> {
    return this.http.get<any>(`${baserUrl}/api/modelo/listarMax`)
  }

  getActividadAtrasada(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/actividad/listaratrasa`)
  }

  getObtenerPersonaId(id:number): Observable<Persona2> {
    return this.http.get<Persona2>(`${baserUrl}/api/persona/buscarpersonaId/`+id);

  }

  getActividadCumplida(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/actividad/listarCumpli`)
  }
  CriterioUltimoModelo(id_modelo: number): Observable<CriteUsuarioProjection[]> {
    return this.http.get<CriteUsuarioProjection[]>(`${baserUrl}/api/criterio/CriteriosUltimoModelo/${id_modelo}`);
  }
  //metodo para consumir las evidencias rechasadas
  public getEvidenciaAtrasFecha(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/actividad/listarActAtrasa`);
  }

  //listar observaciones por actividad
  public getObservacionByActi(id:number): Observable<Observacion[]> {
    return this.http.get<Observacion[]>(`${baserUrl}/api/observacion/buscarObserByActiv/`+id);

  }
  obtenerDatosCriterios(id_modelo: number): Observable<CriterioSubcriteriosProjection[]> {
    return this.http.get<CriterioSubcriteriosProjection[]>(`${baserUrl}/api/criterio/datosCriterios/${id_modelo}`);
  }

  obtenerDatosCriteriosAdmin(id:number): Observable<CriterioSubcriteriosProjection[]> {
    return this.http.get<CriterioSubcriteriosProjection[]>(`${baserUrl}/api/criterio/listCriAdmin/`+id);
  }

  getCriterioPorEvidencia(idEvidencia: number): Observable<Criterio[]> {
    return this.http.get<Criterio[]>(`${baserUrl}/api/criterio/obtenerNombreCriterioPorEvidencia/${idEvidencia}`);
  }

  getCriterioPorEvidenciaproyeccion(idEvidencia: number): Observable<proyeccionCriterio[]> {
    return this.http.get<proyeccionCriterio[]>(`${baserUrl}/api/criterio/obtenerNombreCriterioPorEvidenciaproyeccion/${idEvidencia}`);
  }

  getcriresponsable(id_modelo: number,id:number): Observable<CriRespProjection[]> {
    return this.http.get<CriRespProjection[]>(`${baserUrl}/api/criterio/listcriresp/${id}/${id_modelo}`);
  }

  //esta aqui
  getcriteriousuario(id:number, id_modelo: number): Observable<CriteUsuarioProjection[]> {
    return this.http.get<CriteUsuarioProjection[]>(`${baserUrl}/api/criterio/listarcriteriosUsuarios/${id}/${id_modelo}`);
  }
  getvalores(id_modelo: number): Observable<ValoresProjection[]> {
    return this.http.get<ValoresProjection[]>(`${baserUrl}/api/criterio/listarvalores/${id_modelo}`);
  }
  getvalorescriterio(id_modelo: number,nombre:string): Observable<ValoresProjection[]> {
    return this.http.get<ValoresProjection[]>(`${baserUrl}/api/criterio/valorescriterio/${id_modelo}/${nombre}`);
  }
  getvalorad(id_modelo: number,id:number): Observable<ValoresProjection[]> {
    return this.http.get<ValoresProjection[]>(`${baserUrl}/api/criterio/listvalad/${id_modelo}/${id}`);
  }

  getvaloresponsable(id_modelo: number,id:number): Observable<ValoresProjection[]> {
    return this.http.get<ValoresProjection[]>(`${baserUrl}/api/criterio/listvalresp/${id_modelo}/${id}`);
  }

  getIdCriterio(nombre: string): Observable<IdCriterioProjection> {
    return this.http.get<IdCriterioProjection>(`${baserUrl}/api/criterio/idcriterio/${nombre}`);
  }

  getCriterioAdm(modelId: number, userId: number): Observable<CriterioByAdmin[]>{
    return this.http.get<CriterioByAdmin[]>(`${baserUrl}/api/criterio/listCriAdmin/${modelId}/${userId}`);
  }  
///@GetMapping criteriosporusuarioymodelo/{usuarioId}/{modeloId}
  getListaCriteriosAsignados(idModelo: number, usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/api/criterio/criteriosporusuarioymodelo/${usuarioId}/${idModelo}`);
  }

  getCriteriosByAdminUltimateModel(userId: number): Observable<CriterioByAdmin[]> {
    return this.http.get<CriterioByAdmin[]>(`${baserUrl}/api/criterio/listCriAdminultimodel/${userId}`);
  }
  getvaloresporcCriterios(id_modelo: number): Observable<CriterioPorcProjection[]> {
    return this.http.get<CriterioPorcProjection[]>(`${baserUrl}/api/criterio/listarporccriterios/${id_modelo}`);
  }
}
