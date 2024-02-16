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

  getNotificaciones(id:any):Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${baserUrl}/api/notificacion/listarnotificaciones/${id}`);
  }

  crear(noti: Notificacion): Observable<Notificacion> {
    return this.http.post<Notificacion>(`${baserUrl}/api/notificacion/crear`, noti);
  }

  actualizar(noti:any):Observable<any>{
    return this.http.put(`${baserUrl}/api/notificacion/actualizar/${noti}`,null);
  }

  allnotificacion(noti:any):Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${baserUrl}/api/notificacion/listartodo/${noti}`);
  }

  allnotificacionTODO(noti:any,userId: number):Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${baserUrl}/api/notificacion/listartodo2/${noti}/${userId}`);
  }

  todonotificaciones():Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${baserUrl}/api/notificacion/listarTodasNotificaciones`);
  }

}
