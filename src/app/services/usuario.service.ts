import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Usuario2 } from './../models/Usuario2';
import baserUrl from './helper';
import { ResponsableProjection } from '../interface/ResponsableProjection';
import { SeguimientoUsuarioProjection } from '../interface/SeguimientoUsuarioProjection';
import { UsuariosProjection } from '../interface/UsuariosProjection';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private httpClient: HttpClient) { }
  //Metodo para crear
  createUsuarioSup(usuarioObj: Usuario2, idRol: number[]) {
    return this.httpClient.post(`${baserUrl}/usuarios/crearsup`, usuarioObj, { params: { rolIds: idRol } });
  }
  createUsuarioAdm(usuarioObj: Usuario2, idRol: number, idAdmin: number, idModelo: number) {
    console.log(usuarioObj);
    console.log('idRol', idRol);
    console.log('idAdmin', idAdmin);
    console.log('idModelo', idModelo);
    return this.httpClient.post(`${baserUrl}/usuarios/crearadm/${idRol}/${idAdmin}/${idModelo}`, usuarioObj);
  }

  //Metodo para listar
  // getResponsablesList(): Observable<Usuario2[]> {
  //   return this.httpClient.get<Usuario2[]>(`${baserUrl}/usuarios/responsables`);
  // }

  //Metodo para editar
  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/usuarios/actualizar/${id}`, crite);
  }

  //Metodo para eliminar
  eliminarUsuarioLogic(detalle: number): Observable<any> {
    return this.http.put(`${baserUrl}/usuarios/eliminarlogic/${detalle}`, detalle);
  }

  //eliminado responsable
  eliminarRespLogic(id: number, idModelo: number): Observable<any> {
    return this.http.put(`${baserUrl}/usuarios/eliminarlogicResp/${id}/${idModelo}`, {});
  }

  //Metodo para buscar
  obtenerUsuario(username: string): Observable<boolean> {
    const url = `${baserUrl}/usuarios/buscar/${username}`;
    return this.http.get<boolean>(url);
  }

  listarAdminDatos(): Observable<Usuario2[]> {
    return this.httpClient.get<Usuario2[]>(`${baserUrl}/usuarios/listarAdminDatos`);
  }

  listSeguiminetoUsers(): Observable<SeguimientoUsuarioProjection[]> {
    return this.httpClient.get<SeguimientoUsuarioProjection[]>(`${baserUrl}/usuarios/listarSeguimientoUsuario`);
  }

  //y aqui principal
  getusuarioscrite(id_modelo: number): Observable<UsuariosProjection[]> {
    return this.http.get<UsuariosProjection[]>(`${baserUrl}/usuarios/listUserCrite/${id_modelo}`);
  }
}
