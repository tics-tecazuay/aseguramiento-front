import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';
import { map, Observable } from 'rxjs';
import { Criterio } from '../models/Criterio';
import { asigna_R } from '../models/Asigna-Responsable';
import { usuario } from '../models/Usuario';
import { Usuario2 } from '../models/Usuario2';
import { ResponsableProjection } from '../interface/ResponsableProjection';
import { AsignacionProjection } from '../interface/AsignacionProjection';


@Injectable({
  providedIn: 'root'
})
export class AsignacionResponsableService {

  constructor(private httpClient: HttpClient) { }

  //LISTAR RESPONSABLE
  public listarUsuario(): Observable<usuario[]> {
    return this.httpClient.get(`${baserUrl}/usuarios/listar`).
      pipe(map((response) => response as usuario[]));
  }

 //Listar responsables
 public getResponsables(id_modelo: number): Observable<ResponsableProjection[]> {
  return this.httpClient.get(`${baserUrl}/usuarios/responsablesGeneral/${id_modelo}`).
    pipe(map((response) => response as ResponsableProjection[]));
}


  //BUSCAR DE RESPONSABLES POR ADMIN
  public getlistadeResponsablesByAdmin(idModel: number, idAdministrador: number): Observable<ResponsableProjection[]> {
    return this.httpClient.get<ResponsableProjection[]>(`${baserUrl}/api/asignacion_responsable/listadeResponsablesByAdmin/${idModel}/${idAdministrador}`);
  }


  //LISTAR CRITERIOS
  public listarCriterios(): Observable<Criterio[]> {
    return this.httpClient.get(`${baserUrl}/api/criterio/listar`).
      pipe(map((response) => response as Criterio[]));
  }

  //GUARDAR ASIGNACION
  public createAsigna(asigna: asigna_R): Observable<asigna_R> {
    return this.httpClient.post<asigna_R>(`${baserUrl}/api/asignacion_admin/crear`, asigna);
  }

  //LISTAR ASIGNACION
  public listarAsignarResponsable(): Observable<asigna_R[]> {
    return this.httpClient.get(`${baserUrl}/api/asignacion_admin/listar`).
      pipe(map((response) => response as asigna_R[]));
  }
  public asignaradmin(id_modelo: number, veri: string): Observable<AsignacionProjection[]> {
    return this.httpClient.get(`${baserUrl}/api/asignacion_admin/asignacionadmin/${id_modelo}/${veri}`).
      pipe(map((response) => response as AsignacionProjection[]));
  }
  //EDITAR ASIGNACION
  public updateAsigna(asigna: asigna_R) {
    console.log(asigna.id_asignacion);
    return this.httpClient.put<asigna_R>(`${baserUrl}/api/asignacion_admin/actualizar/` + asigna.id_asignacion, asigna);
  }

  //ELIMINAR ASIGNACION
  public deleteAsigna(asigna: asigna_R) {
    return this.httpClient.delete<asigna_R>(`${baserUrl}/api/asignacion_admin/eliminar/` + asigna.id_asignacion);
  }

  //ELIMINAR ASIGNACION RESPONSABLE
  public deleteAsignacionResponsableAdmin(id_usuarioResponsable: number) {
    return this.httpClient.put<any>(`${baserUrl}/api/asignacion_responsable/eliminarlogic/` + id_usuarioResponsable, {});
  }

  //BUSCAR POR ID
  public getAsignacionId(id: number): Observable<asigna_R> {
    return this.httpClient.get<asigna_R>(`${baserUrl}/api/asignacion_admin/buscar/` + id);
  }



}
