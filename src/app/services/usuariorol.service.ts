import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';
import { Observable } from 'rxjs';
import { UsuarioRol } from '../models/UsuarioRol';
import { CriteUsuarioProjection } from '../interface/CriteUsuarioProjection';
import { Rol } from '../models/Rol';
import { Usuario2 } from '../models/Usuario2';

@Injectable({
  providedIn: 'root'
})
export class UsuariorolService {
  constructor(private http: HttpClient) { }
  getusuarios(): Observable<any[]> {
    return this.http.get<UsuarioRol[]>(`${baserUrl}/api/usuariorol/listarv`);
  }
  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/usuariorol/actualizar/${id}`, crite);
  }
  actualizarSup(idUsuarioRol: number, usarioRol: any, idRol: number[]): Observable<any> {
    return this.http.put(`${baserUrl}/api/usuariorol/actualizarsup/${idUsuarioRol}`, usarioRol, { params: { rolIds: idRol } });
  }
  getcriterios(id: number, id_modelo: number): Observable<CriteUsuarioProjection[]> {
    return this.http.get<CriteUsuarioProjection[]>(`${baserUrl}/api/criterio/datosuser/${id}/${id_modelo}`);
  }
  buscaruser(usename: string): Observable<UsuarioRol> {
    return this.http.get<UsuarioRol>(`${baserUrl}/api/usuarios/buscaruser/${usename}`);
  }
  buscaruserbyusername(username: string): Observable<Usuario2> {
    return this.http.get<Usuario2>(`${baserUrl}/usuarios/buscaruser/${username}`);
  }
  getRolesPorUsername(username: string): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${baserUrl}/api/usuariorol/listarrolesporusername/${username}/`);
  }
}
