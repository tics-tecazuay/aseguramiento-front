import { Injectable } from '@angular/core';
import baserUrl from './helper';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../models/Notificacion';
@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private http: HttpClient) { }

  crear(noti: Notificacion): Observable<Notificacion> {
    return this.http.post<Notificacion>(`${baserUrl}/api/notificacion/crear`, noti);
  }
  
  getNotificaciones(id_usuario: number, id_modelo: number):Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${baserUrl}/api/notificacion/listarnotificaciones/${id_usuario}/${id_modelo}`);
  }

  actualizar(noti:any):Observable<any>{
    return this.http.put(`${baserUrl}/api/notificacion/actualizar/${noti}`,null);
  }

  notificacionePorRol(rol:any, id_modelo: number):Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${baserUrl}/api/notificacion/listarnotificacionesrol/${rol}/${id_modelo}`);
  }

  allnotificacionTODO(noti:any,userId: number,id_modelo: number):Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${baserUrl}/api/notificacion/listartodo2/${noti}/${userId}/${id_modelo}`);
  }

  obtenerTodasNotificaciones(id_modelo: number):Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${baserUrl}/api/notificacion/listartodasnotificaciones/${id_modelo}`);
  }

}
