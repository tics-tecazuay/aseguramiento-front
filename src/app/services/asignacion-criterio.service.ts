import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
 import baserUrl from './helper';
import { Criterio } from '../models/Criterio';
import { AsignacionAdminPDTO, Asignacion_Criterios } from '../models/Asignacion-Criterios';
import { usuario } from '../models/Usuario';
import { NombreAsigProjection } from '../interface/NombreAsigProjection';
import { AsignacionProjection } from '../interface/AsignacionProjection';

@Injectable({
  providedIn: 'root'
})
export class AsignacionCriterioService {

  constructor(private httpClient: HttpClient) { }

  //LISTAR CRITERIOS
  public listarCriterios(): Observable<Criterio[]> {
    return this.httpClient.get(`${baserUrl}/api/criterio/listar`).
      pipe(map((response) => response as Criterio[]));
  }

  //GUARDAR ASIGNACION
  public createAsigna(asigna: Asignacion_Criterios): Observable<Asignacion_Criterios> {
    return this.httpClient.post<Asignacion_Criterios>(`${baserUrl}/api/asignacion_admin/crear`, asigna);
  }

  //LISTAR ASIGNACION
  public listarAsignarResponsable(): Observable<Asignacion_Criterios[]> {
    return this.httpClient.get(`${baserUrl}/api/asignacion_admin/listar`).
      pipe(map((response) => response as Asignacion_Criterios[]));
  }
  
  //EDITAR ASIGNACION
  public updateAsigna(asigna: Asignacion_Criterios) {
    return this.httpClient.put<Asignacion_Criterios>(`${baserUrl}/api/asignacion_admin/actualizar/` + asigna.id_asignacion, asigna);
  }

  //ELIMINAR ASIGNACION
  public deleteAsigna(asigna: Asignacion_Criterios) {
    return this.httpClient.delete<Asignacion_Criterios>(`${baserUrl}/api/asignacion_admin/eliminar/` + asigna.id_asignacion);
  }

  //BUSCAR POR ID
  public getAsignacionId(id: number): Observable<Asignacion_Criterios> {
    return this.httpClient.get<Asignacion_Criterios>(`${baserUrl}/api/asignacion_admin/buscar/` + id);
  }

  crearAsignacion(dto: AsignacionAdminPDTO): Observable<any> {
    return this.httpClient.post<any>(`${baserUrl}/api/asignacion_admin/crear`, dto);
  }

  public updateAsignacion_Admin(id_asignacion: any, asignacion: Asignacion_Criterios): Observable<Asignacion_Criterios> {
    return this.httpClient.put<Asignacion_Criterios>(`${baserUrl}/api/asignacion_admin/actualizarAgregado/${id_asignacion}`, asignacion);
  }

  //@PutMapping("/eliminarlogic/{id}")
  public deleteAsignacion_Admin(id: any): Observable<Asignacion_Criterios> {
    return this.httpClient.put<Asignacion_Criterios>(`${baserUrl}/api/asignacion_admin/eliminarlogic/${id}`, id);
  }

  //Actualizar estado
  public actualizarEstado(id: number): Observable<AsignacionAdminPDTO> {
    return this.httpClient.put<AsignacionAdminPDTO>(`${baserUrl}/api/asignacion_admin/actualizarEstado/${id}`,null);
  }


  public nombre_Admin(id_modelo:number,id_criterio:number): Observable<NombreAsigProjection> {
    return this.httpClient.get<NombreAsigProjection>(`${baserUrl}/api/asignacion_admin/listarnombre_admin/${id_modelo}/${id_criterio}`);
  }
  
//@GetMapping(veradminsporcriterio/{id_modelo}/{id_criterio})
  public verAdminsPorCriterio(id_modelo: number, id_criterio: number): Observable<AsignacionProjection[]> {
    return this.httpClient.get<AsignacionProjection[]>(`${baserUrl}/api/asignacion_admin/veradminsporcriterio/${id_modelo}/${id_criterio}`);
  }


  public verResponsablesPorCriterio(id_modelo: number, id_criterio: number): Observable<AsignacionProjection[]> {
    return this.httpClient.get<AsignacionProjection[]>(`${baserUrl}/api/asignacion_admin/verresponsablesporcriterio/${id_modelo}/${id_criterio}`);
  }

  public busqueda_asignacion_especifica(idUsuario: number, idModelo: number, idCriterio: number): Observable<Asignacion_Criterios> {
    return this.httpClient.get<Asignacion_Criterios>(`${baserUrl}/api/asignacion_admin/busqueda_especifica/${idUsuario}/${idModelo}/${idCriterio}`);
  }
}
