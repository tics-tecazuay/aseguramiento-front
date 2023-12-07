import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
 import baserUrl from './helper';
import { Criterio } from '../models/Criterio';
import { Asignacion_Criterios } from '../models/Asignacion-Criterios';
import { usuario } from '../models/Usuario';
import { NombreAsigProjection } from '../interface/NombreAsigProjection';

@Injectable({
  providedIn: 'root'
})
export class AsignacionCriterioService {

  constructor(private httpClient: HttpClient) { }

  //LISTAR RESPONSABLE
  public listarUsuario(): Observable<usuario[]> {
    return this.httpClient.get(`${baserUrl}/usuarios/listar`).
      pipe(map((response) => response as usuario[]));
  }

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

  //@GetMapping("/listarAsignacion_AdminPorUsuario/{id_usuario}")
  public listarAsignacion_AdminPorUsuario(id_usuario: any,id_modelo:number): Observable<Asignacion_Criterios[]> {
    return this.httpClient.get<Asignacion_Criterios[]>(`${baserUrl}/api/asignacion_admin/listarAsignacion_AdminPorUsuario/${id_usuario}/${id_modelo}`);
  }

  //@PostMapping("/crear")
  public createAsignacion_Admin(asignacion: Asignacion_Criterios): Observable<Asignacion_Criterios> {
    return this.httpClient.post<Asignacion_Criterios>(`${baserUrl}/api/asignacion_admin/crear`, asignacion);
  }


  //@GetMapping("/listarAsignacion_AdminPorUsuarioCriterio/{id_criterio}/{id_usuario}")
  public listarAsignacion_AdminPorUsuarioCriterio(id_criterio: any, id_modelo:number): Observable<Asignacion_Criterios[]> {
    return this.httpClient.get<Asignacion_Criterios[]>(`${baserUrl}/api/asignacion_admin/listarAsignacion_AdminPorUsuarioCriterio/${id_criterio}/${id_modelo}`);
  }

  public updateAsignacion_Admin(id_asignacion: any, asignacion: Asignacion_Criterios): Observable<Asignacion_Criterios> {
    return this.httpClient.put<Asignacion_Criterios>(`${baserUrl}/api/asignacion_admin/actualizarAgregado/${id_asignacion}`, asignacion);
  }

  //@PutMapping("/eliminarlogic/{id}")
  public deleteAsignacion_Admin(id: any): Observable<Asignacion_Criterios> {
    return this.httpClient.put<Asignacion_Criterios>(`${baserUrl}/api/asignacion_admin/eliminarlogic/${id}`, id);
  }

  public nombre_Admin(id_modelo:number,id_criterio:number): Observable<NombreAsigProjection> {
    return this.httpClient.get<NombreAsigProjection>(`${baserUrl}/api/asignacion_admin/listarnombre_admin/${id_modelo}/${id_criterio}`);
  }
}
