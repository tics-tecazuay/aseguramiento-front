import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import baserUrl from './helper';
import { Evidencia } from '../models/Evidencia';
import { ActividadesCalendar, Asigna_Evi } from '../models/Asignacion-Evidencia';
import { usuario } from '../models/Usuario';
import { ResponsableProjection } from '../interface/ResponsableProjection';
import { AsignaProjection } from '../interface/AsignaProjection';
import { EvidenciaReApPeAtr, HistorialAsigEvi } from '../interface/AsigEvidProjection';

@Injectable({
  providedIn: 'root'
})
export class AsignaEvidenciaService {

  constructor(private httpClient: HttpClient) { }

  //LISTAR RESPONSABLE
  public listarUsuario(): Observable<usuario[]> {
    return this.httpClient.get(`${baserUrl}/usuarios/listar`).
      pipe(map((response) => response as usuario[]));
  }

  //LISTAR EVIDENCIAS
  public listarEvidencia(): Observable<Evidencia[]> {
    return this.httpClient.get(`${baserUrl}/api/evidencia/listarv`).
      pipe(map((response) => response as Evidencia[]));
  }
  //LISTAR EVIDENCIAS
  public listarEvidenciaprueba(): Observable<Evidencia[]> {
    return this.httpClient.get(`${baserUrl}/api/evidencia/listarpruebasevi`).
      pipe(map((response) => response as Evidencia[]));
  }

  //GUARDAR ASIGNACION_EVICENCIA
  public createAsigna(asigna: Asigna_Evi): Observable<Asigna_Evi> {
    return this.httpClient.post<Asigna_Evi>(`${baserUrl}/api/asignacionevidencia/crear`, asigna);
  }

  //LISTAR ASIGNACION
  public listarAsignarEvi(): Observable<Asigna_Evi[]> {
    return this.httpClient.get(`${baserUrl}/api/asignacionevidencia/listarv`).
      pipe(map((response) => response as Asigna_Evi[]));
  }

  getActiCalendar(id_user: number): Observable<ActividadesCalendar[]> {
    return this.httpClient.get<ActividadesCalendar[]>(`${baserUrl}/api/asignacionevidencia/actCalendar/${id_user}`);
  }


  public getfechaAsignacion(id_evidencia: number,id_modelo:number): Observable<Asigna_Evi> {
    return this.httpClient.get<Asigna_Evi>(`${baserUrl}/api/asignacionevidencia/fecha/${id_evidencia}/${id_modelo}`);
  }

  //EDITAR ASIGNACION
  public updateAsigna(asigna: Asigna_Evi) {
    console.log(asigna.id_asignacion_evidencia);
    return this.httpClient.put<Asigna_Evi>(`${baserUrl}/api/asignacionevidencia/actualizar/` + asigna.id_asignacion_evidencia, asigna);
  }
  public editarAsigna(asigna: Asigna_Evi) {
    return this.httpClient.put<Asigna_Evi>(`${baserUrl}/api/asignacionevidencia/editar/` + asigna.id_asignacion_evidencia, asigna);
  }
  //ELIMINAR ASIGNACION
  public deleteAsigna(asigna: Asigna_Evi) {
    return this.httpClient.put<Asigna_Evi>(`${baserUrl}/api/asignacionevidencia/eliminarlogic/` + asigna.id_asignacion_evidencia,asigna);
  }

  //BUSCAR POR ID
  public getbuscarAsignacion(id: number): Observable<Asigna_Evi> {
    return this.httpClient.get<Asigna_Evi>(`${baserUrl}/api/asignacionevidencia/buscar/${id}`);
  }


   //Metodo para eliminar

   eliminarAsignaLogic(detalle: number): Observable<any> {
    console.log(detalle)
    return this.httpClient.put(`${baserUrl}/api/asignacionevidencia/eliminarlogic/${detalle}`, detalle);

  }

  eliminasigna(id: number,id_evi:number,id_usuario:number,id_modelo:number): Observable<any> {
    console.log(id)
    return this.httpClient.put(`${baserUrl}/api/asignacionevidencia/elimasig/${id}/${id_evi}/${id_usuario}/${id_modelo}`, id);

  }
   

    public getAsignacionUsuario(user: String): Observable< Evidencia[]> {
      return this.httpClient.get<  Evidencia[]>(`${baserUrl}/api/asignacionevidencia/listarEviUsua/` + user);
    }

    public getAsignacion(): Observable<AsignaProjection[]> {
      return this.httpClient.get<AsignaProjection[]>(`${baserUrl}/api/asignacionevidencia/listasignacion`);
    }

    /// HISTORIAL ASIGNACION EVIDENCIA 
    public getHistorialAsigEvByUserCrit(userAsig: number, crite: number, veri: string): Observable<HistorialAsigEvi[]> {
      return this.httpClient.get<HistorialAsigEvi[]>(`${baserUrl}/api/historialasignacionevidencia/listarHistorial/${userAsig}/${crite}/${veri}`);
    }

    //LISTAR EVIDENCIAS RECHAZADAS - APROBADAS - PENDIENTES - ATRASADAS

    public getEvidenciaRe(): Observable<EvidenciaReApPeAtr[]> {
      return this.httpClient.get<EvidenciaReApPeAtr[]>(`${baserUrl}/api/asignacionevidencia/listEviR`);
    }

    public getEvidenciaAp(): Observable<EvidenciaReApPeAtr[]> {
      return this.httpClient.get<EvidenciaReApPeAtr[]>(`${baserUrl}/api/asignacionevidencia/listEviAp`);
    }

    public getEvidenciaPen(): Observable<EvidenciaReApPeAtr[]> {
      return this.httpClient.get<EvidenciaReApPeAtr[]>(`${baserUrl}/api/asignacionevidencia/listEviPen`);
    }
}
