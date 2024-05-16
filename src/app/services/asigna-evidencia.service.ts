import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import baserUrl from './helper';
import { Evidencia } from '../models/Evidencia';
import {
  ActividadesCalendar,
  AsignaEvidenciaParamss,
  Asigna_Evi,
} from '../models/Asignacion-Evidencia';
import { usuario } from '../models/Usuario';
import { AsignaProjection } from '../interface/AsignaProjection';
import {
  EvidenciaReApPeAtr,
  HistorialAsigEvi,
} from '../interface/AsigEvidProjection';

@Injectable({
  providedIn: 'root',
})
export class AsignaEvidenciaService {
  constructor(private httpClient: HttpClient) { }

  //LISTAR RESPONSABLE
  public listarUsuario(): Observable<usuario[]> {
    return this.httpClient
      .get(`${baserUrl}/usuarios/listar`)
      .pipe(map((response) => response as usuario[]));
  }

  //LISTAR EVIDENCIAS
  public listarEvidencia(): Observable<Evidencia[]> {
    return this.httpClient
      .get(`${baserUrl}/api/evidencia/listarv`)
      .pipe(map((response) => response as Evidencia[]));
  }
  //LISTAR EVIDENCIAS
  public listarEvidenciaprueba(): Observable<Evidencia[]> {
    return this.httpClient
      .get(`${baserUrl}/api/evidencia/listarpruebasevi`)
      .pipe(map((response) => response as Evidencia[]));
  }
  // // Método para crear asignaciones de evidencia
  // createAsigna(asigna: AsignaEvidenciaParams[]): Observable<AsignaEvidenciaParams[]> {
  //   return this.httpClient.post<AsignaEvidenciaParams[]>(
  //     `${baserUrl}/api/asignacionevidencia/crear`,
  //     asigna
  //   );
  // }

  createAsigna2(asigna: AsignaEvidenciaParamss[]): Observable<AsignaEvidenciaParamss[]> {
    return this.httpClient.post<AsignaEvidenciaParamss[]>(
      `${baserUrl}/api/asignacionevidencia/crear`,
      asigna
    );
  }
  //LISTAR ASIGNACION
  public listarAsignarEvi(): Observable<Asigna_Evi[]> {
    return this.httpClient
      .get(`${baserUrl}/api/asignacionevidencia/listarv`)
      .pipe(map((response) => response as Asigna_Evi[]));
  }

  getActiCalendar(id_user: number, id_modelo: number): Observable<ActividadesCalendar[]> {
    return this.httpClient.get<ActividadesCalendar[]>(
      `${baserUrl}/api/asignacionevidencia/actCalendar/${id_user}/${id_modelo}`
    );
  }

  public getfechaAsignacion(
    id_evidencia: number,
    id_modelo: number
  ): Observable<Asigna_Evi> {
    return this.httpClient.get<Asigna_Evi>(
      `${baserUrl}/api/asignacionevidencia/fecha/${id_evidencia}/${id_modelo}`
    );
  }

  //EDITAR ASIGNACION
  public updateAsigna(asigna: Asigna_Evi) {
    console.log(asigna.id_asignacion_evidencia);
    return this.httpClient.put<Asigna_Evi>(
      `${baserUrl}/api/asignacionevidencia/actualizar/` +
      asigna.id_asignacion_evidencia,
      asigna
    );
  }
  public editarAsigna(asigna: Asigna_Evi) {
    return this.httpClient.put<Asigna_Evi>(
      `${baserUrl}/api/asignacionevidencia/editar/` +
      asigna.id_asignacion_evidencia,
      asigna
    );
  }

  cambiarUsuario(idEvidencia: number, idNuevoUsuario: number, idModelo: number): Observable<any> {
    return this.httpClient.put<any>(
      `${baserUrl}/api/asignacionevidencia/cambiarUsuario/${idEvidencia}/${idNuevoUsuario}/${idModelo}`, {}
    );
  }

  //ELIMINAR ASIGNACION
  public deleteAsigna(asigna: Asigna_Evi) {
    return this.httpClient.put<Asigna_Evi>(
      `${baserUrl}/api/asignacionevidencia/eliminarlogic/` +
      asigna.id_asignacion_evidencia,
      asigna
    );
  }

  //BUSCAR POR ID
  public getbuscarAsignacion(id: number): Observable<Asigna_Evi> {
    return this.httpClient.get<Asigna_Evi>(
      `${baserUrl}/api/asignacionevidencia/buscar/${id}`
    );
  }

  //Metodo para eliminar

  eliminarAsignaLogic(detalle: number): Observable<any> {
    console.log(detalle);
    return this.httpClient.put(
      `${baserUrl}/api/asignacionevidencia/eliminarlogic/${detalle}`,
      detalle
    );
  }

  eliminasigna(
    id: number,
    id_evi: number,
    id_usuario: number,
    id_modelo: number
  ): Observable<any> {
    console.log(id);
    return this.httpClient.put(
      `${baserUrl}/api/asignacionevidencia/elimasig/${id}/${id_evi}/${id_usuario}/${id_modelo}`,
      id
    );
  }

  public getAsignacionUsuario(user: String): Observable<Evidencia[]> {
    return this.httpClient.get<Evidencia[]>(
      `${baserUrl}/api/asignacionevidencia/listarEviUsua/` + user
    );
  }

  public getAsignacion(id_modelo: number): Observable<AsignaProjection[]> {
    return this.httpClient.get<AsignaProjection[]>(
      `${baserUrl}/api/asignacionevidencia/listasignacion/${id_modelo}`
    );
  }

  /// HISTORIAL ASIGNACION EVIDENCIA
  public getHistorialAsigEvByUserCrit(
    crite: number,
    veri: string,
    idModel: number
  ): Observable<HistorialAsigEvi[]> {
    return this.httpClient.get<HistorialAsigEvi[]>(
      `${baserUrl}/api/historialasignacionevidencia/listarHistorial/${crite}/${veri}/${idModel}`
    );
  }

  //LISTAR EVIDENCIAS RECHAZADAS - APROBADAS - PENDIENTES - ATRASADAS

  getEvidenciasByEstado(estado: string, id_modelo: number): Observable<EvidenciaReApPeAtr[]> {
    return this.httpClient.get<EvidenciaReApPeAtr[]>(`${baserUrl}/api/asignacionevidencia/evidencias/${estado}/${id_modelo}`);
  }
  getEvidenciasByEstadoAdm(estado: string, id_admin: number, idModel: number): Observable<EvidenciaReApPeAtr[]> {
    return this.httpClient.get<EvidenciaReApPeAtr[]>(`${baserUrl}/api/asignacionevidencia/evidenciasAdm/${estado}/${id_admin}/${idModel}`);
  }

  getAsignacionPorUsuario(usuarioId: number): Observable<AsignaProjection[]> {
    return this.httpClient.get<AsignaProjection[]>(
      `${baserUrl}/api/asignacionevidencia/listasignacioneviporuser/${usuarioId}`
    );
  }

  public editarEstadoArch(idAsignacion: number, estado: boolean): Observable<any> {
    return this.httpClient.put<any>(
      `${baserUrl}/api/asignacionevidencia/editarArchSubido/${idAsignacion}/${estado}`,
      [] // No necesitas enviar un cuerpo en este caso
    );
  }

  getCountArchivos(idAsignacionEv: number): Observable<number> {
    return this.httpClient.get<number>(`${baserUrl}/api/asignacionevidencia/countArchivos/${idAsignacionEv}`);
  }

}
