import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baserUrl from './helper';
 import { Observacion2 } from '../models/Observaciones2';
import { Actividades } from '../models/actividades';
import { ActividadesProjection } from '../interface/ActividadesProjection';
import { ActivAprobadaProjection } from '../interface/ActivAprobadaProjection';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  constructor( private http: HttpClient ) { }



  search(nombre: string): Observable<Actividades[]> {
    const url = `${baserUrl}/api/actividad/buscar/?nombre=${nombre}`;
    return this.http.get<Actividades[]>(url);
  }

  get(): Observable<Actividades[]> {
    const url = `${baserUrl}/api/actividad/listarv`;
    return this.http.get<Actividades[]>(url);
  }
  getAc(id_modelo:number): Observable<ActividadesProjection[]> {
    const url = `${baserUrl}/api/actividad/listaractiv/${id_modelo}`;
    return this.http.get<ActividadesProjection[]>(url);
  }
  crear(actividad: Actividades): Observable<Actividades> {
    return this.http.post<Actividades>(`${baserUrl}/api/actividad/crear`, actividad);
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

  update(id: number, actividades: Actividades): Observable<any> {
    // console.log(actividades)
    return this.http.put(`${baserUrl}/api/actividad/actualizar/${id}`, actividades);
  }


  eliminar(activi:any): Observable<any> {
    return this.http.put(`${baserUrl}/api/actividad/eliminarlogic/${activi.id_actividad}`,activi);
 }
 public geteviasig(user: String): Observable<Actividades[]> {
  return this.http.get<Actividades[]>(`${baserUrl}/api/actividad/buscarusuario/${user}`);
}

public getactivievid(username: string,id_evidencia:number): Observable<Actividades[]> {
  return this.http.get<Actividades[]>(`${baserUrl}/api/actividad/activevid/${username}/${id_evidencia}`);
}
//Observacion
  //Metodo para crear
  createObservacion(r: Observacion2): Observable<Observacion2> {
    return this.http.post<Observacion2>(`${baserUrl}/api/observacion/crear`, r)
  }
  //listar observaciones por actividad
  public getObservacionByActi(id:number): Observable<Observacion2[]> {
    return this.http.get<Observacion2[]>(`${baserUrl}/api/observacion/buscarObserByActiv/`+id);

  }
  //eliminadologico
  eliminarObser(detalle: number): Observable<any> {
    // console.log(detalle)
    return this.http.put(`${baserUrl}/api/observacion/eliminarlogic/${detalle}`, detalle);
  }
public getEviAsig(idEvi: number): Observable<Actividades[]> {
  return this.http.get<Actividades[]>(`${baserUrl}/api/actividad/buscarporEvide/${idEvi}`);

}

public getActByUsua(idUsua: number): Observable<Actividades[]> {
  return this.http.get<Actividades[]>(`${baserUrl}/api/actividad/buscarByUsuario/${idUsua}`);
}

public getActUsu(idEvi: number): Observable<Actividades[]> {
  return this.http.get<Actividades[]>(`${baserUrl}/api/actividad/buscaractiv/${idEvi}`);

}

public getObservaciones(id_actividad: number): Observable<Observacion2[]> {
  return this.http.get<Observacion2[]>(`${baserUrl}/api/observacion/obseractividad/${id_actividad}`);

}
}
