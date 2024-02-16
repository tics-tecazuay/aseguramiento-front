import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baserUrl from './helper';
 import { Observacion2 } from '../models/Observaciones2';
import { Actividades } from '../models/actividades';
import { ActividadesProjection } from '../interface/ActividadesProjection';
import { ActivAprobadaProjection } from '../interface/ActivAprobadaProjection';
import { Asigna_Evi } from '../models/Asignacion-Evidencia';
import { Asigna_EviDTO } from '../models/Asignacion-EvidenciaDTO';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  constructor( private http: HttpClient ) { }
  
  get(): Observable<Actividades[]> {
    const url = `${baserUrl}/api/actividad/listarv`;
    return this.http.get<Actividades[]>(url);
  }
  getAc(id_modelo:number): Observable<ActividadesProjection[]> {
    const url = `${baserUrl}/api/actividad/listaractiv/${id_modelo}`;
    return this.http.get<ActividadesProjection[]>(url);
  }

  getActividadrechazada(id_modelo:number): Observable<ActivAprobadaProjection[]> {
    return this.http.get<ActivAprobadaProjection[]>(`${baserUrl}/api/actividad/actividadatrasa/${id_modelo}`);
  }

  getActividadaprobada(id_modelo:number): Observable<ActivAprobadaProjection[]> {
    return this.http.get<ActivAprobadaProjection[]>(`${baserUrl}/api/actividad/actividadaprobada/${id_modelo}`);
  }

  getActividadpendiente(id_modelo:number): Observable<ActivAprobadaProjection[]> {
    return this.http.get<ActivAprobadaProjection[]>(`${baserUrl}/api/actividad/actividadpendiente/${id_modelo}`);
  }

  update(id: number, actividades: Asigna_Evi): Observable<any> {
    console.log(actividades)
    return this.http.put(`${baserUrl}/api/asignacionevidencia/actualizar/${id}`, actividades);
  }

  geteviasig(user: String): Observable<Asigna_Evi[]> {
  return this.http.get<Asigna_Evi[]>(`${baserUrl}/api/asignacionevidencia/buscarusuario/${user}`);
  }

  getactivievid(username: string,id_evidencia:number): Observable<Asigna_EviDTO[]> {
  return this.http.get<Asigna_EviDTO[]>(`${baserUrl}/api/asignacionevidencia/listarAsigEviUser/${username}/${id_evidencia}`);
  }
  //Observacion
  //Metodo para crear
  createObservacion(r: Observacion2): Observable<Observacion2> {
    return this.http.post<Observacion2>(`${baserUrl}/api/observacion/crear`, r)
  }
  //listar observaciones por actividad
  getObservacionByActi(id:number): Observable<Observacion2[]> {
    return this.http.get<Observacion2[]>(`${baserUrl}/api/observacion/buscarObserByActiv/`+id);

  }
  //eliminadologico
  eliminarObser(detalle: number): Observable<any> {
    console.log(detalle)
    return this.http.put(`${baserUrl}/api/observacion/eliminarlogic/${detalle}`, detalle);
  }
  getEviAsig(idEvi: number): Observable<Asigna_Evi[]> {
  return this.http.get<Asigna_Evi[]>(`${baserUrl}/api/asignacionevidencia/buscarporEvide/${idEvi}`); 
  }

  getActByUsua(idUsua: number): Observable<Actividades[]> {
  return this.http.get<Actividades[]>(`${baserUrl}/api/actividad/buscarByUsuario/${idUsua}`);
  }

  getActUsu(idEvi: number): Observable<Actividades[]> {
  return this.http.get<Actividades[]>(`${baserUrl}/api/actividad/buscaractiv/${idEvi}`);
  }

  getObservaciones(id_asignacion_evidencia: number): Observable<Observacion2[]> {
  return this.http.get<Observacion2[]>(`${baserUrl}/api/observacion/obseractividad/${id_asignacion_evidencia}`);
  }
}
