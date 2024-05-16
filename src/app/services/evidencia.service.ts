import { ValorObtenidoInd } from './../interface/ValorObtenidoInd';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActiDiagramaPieProjection, Evidencia } from '../models/Evidencia';
import { HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { EvidenciaEvProjection, EvidenciasProjection } from '../interface/EvidenciasProjection';
import { EvidenciaCalProjection } from '../interface/EvidenciaCalProjection';
import { AsigEvidProjection } from '../interface/AsigEvidProjection';
import { EvidenciaProjection } from '../interface/EvidenciaProjection';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {
  evidenciaObj: Evidencia[] = [];
  constructor(private http: HttpClient) { }

  crear(r: any): Observable<any> {
    return this.http.post<any>(`${baserUrl}/api/evidencia/crear`, r
    );
  }
  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/evidencia/actualizar/${id}`, crite);
  }

  actualizar2(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/evidencia/actualizar2/${id}`, crite);
  }
  //Metodo para listar
  getEvidencias(): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarv`);
  }
  getEvidenciasAdmin(id: number): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarvAsigna/${id}`);
  }
  getEvidenciaCrite(idcriterio: number): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/evicriterio/${idcriterio}`);
  }
  eliminarEvidencia(evi: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/evidencia/eliminarlogic/${evi.id_evidencia}`, evi);
  }
  getEvidenciaIndicador(id: number): Observable<Evidencia> {
    return this.http.get<Evidencia>(`${baserUrl}/api/evidencia/listarIndicador/${id}`);
  }
  //Listar por usuario
  public getAsignacionUsuario(user: String): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/asignacionevidencia/listarEviUsua/` + user);
  }

  public getEvidenciasAsignadasPorUsuario(user: String, id_modelo: number): Observable<EvidenciaEvProjection[]> {
    return this.http.get<EvidenciaEvProjection[]>(`${baserUrl}/api/evidencia/buscarev/${user}/${id_modelo}`);
  }

  public buscarEvidenciaPorCriterio(username: string, usuarioId: number, idModel: number): Observable<EvidenciaEvProjection[]> {
    return this.http.get<EvidenciaEvProjection[]>(`${baserUrl}/api/evidencia/searchevifiltradoporadm/${username}/${usuarioId}/${idModel}`);
  }

  public getevilist(username: String, idModel: number): Observable<EvidenciaProjection[]> {
    return this.http.get<EvidenciaProjection[]>(`${baserUrl}/api/evidencia/evidenuser/${username}/${idModel}`);
  }

  public geteviuserpen(username: String, id_modelo: number): Observable<EvidenciaProjection[]> {
    return this.http.get<EvidenciaProjection[]>(`${baserUrl}/api/evidencia/evidenuserpendiente/${username}/${id_modelo}`);
  }
  public getevical(id_evidencia: number, id_modelo: number): Observable<EvidenciaCalProjection> {
    return this.http.get<EvidenciaCalProjection>(`${baserUrl}/api/evidencia/evidenciacal/${id_evidencia}/${id_modelo}`);
  }

  public obtenerEvidenciasPorCriterio(id_criterio: number, id_modelo: number): Observable<AsigEvidProjection[]> {
    return this.http.get<AsigEvidProjection[]>(`${baserUrl}/api/evidencia/obtenerevidenciasporcriterio/${id_criterio}/${id_modelo}`);
  }

  public geteviadmin(idUser: number, id_modelo: number): Observable<AsigEvidProjection[]> {
    return this.http.get<AsigEvidProjection[]>(`${baserUrl}/api/evidencia/eviasigadmin/${idUser}/${id_modelo}`);
  }
  //LISTAR RESPONSABLE EN SUPERADMIN
  public listarUsuario(id_modelo: number): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/usuarios/listarResDatos/${id_modelo}`);
  }
  //LISTAR RESPONSABLES DE ADMIN
  public getlistadeResponsablesAdmin(idAdministrador: number, idModel: number): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/usuarios/listaResponsablesFromAdmin/${idAdministrador}/${idModel}`);
  }

  public geteviaprobada(id_modelo: number): Observable<EvidenciasProjection[]> {
    return this.http.get<EvidenciasProjection[]>(`${baserUrl}/api/evidencia/evidenciaprobada/${id_modelo}`);
  }

  public getevirechazada(id_modelo: number): Observable<EvidenciasProjection[]> {
    return this.http.get<EvidenciasProjection[]>(`${baserUrl}/api/evidencia/evidenciarechazada/${id_modelo}`);
  }

  //metodo para consumir servicio @GetMapping("/listarEvidenciaPorIndicador/{id_indicador}")
  public getEvidenciaPorIndicador(id: number): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarEvidenciaPorIndicador/${id}`);
  }

  public listarsolorespon(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/usuarios/listarsoloResponsables`);
  }
  public getPorcentajesEstadosPorResponsable(responsableId: number, id_modelo: number): Observable<ActiDiagramaPieProjection> {
    return this.http.get<ActiDiagramaPieProjection>(`${baserUrl}/api/evidencia/porcentajeEstadosdeActividades/${responsableId}/${id_modelo}`);
  }
  public getPorcentajesEstadosGeneral(id_modelo: number): Observable<ActiDiagramaPieProjection> {
    return this.http.get<ActiDiagramaPieProjection>(`${baserUrl}/api/evidencia/porcentajeEstadosdeActividadesGeneral/${id_modelo}`);
  }
  editarValorEvid(id_evid: number, valor_obtenido: number): Observable<any> {
    return this.http.put<any>(`${baserUrl}/api/evidencia/editarValorEvid/${id_evid}`, null, {
      params: { valorevid: valor_obtenido } // Enviar el parámetro como parte de la solicitud
    });
  }
  editarValoresEvidaCero(id_indicador: number): Observable<any> {
    return this.http.put<any>(`${baserUrl}/api/evidencia/editarValoresEvidaCero/${id_indicador}`, {});
  }
  getValoresObtenidosEvidPorIndicador(id_indicador: number): Observable<ValorObtenidoInd> {
    return this.http.get<ValorObtenidoInd>(`${baserUrl}/api/evidencia/valoresObtenidosEvidPorIndicador/${id_indicador}`);
  }
}
