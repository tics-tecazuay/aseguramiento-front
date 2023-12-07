import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Evidencia } from '../models/Evidencia';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { EvidenciasProjection } from '../interface/EvidenciasProjection';
import { EvidenciaCalProjection } from '../interface/EvidenciaCalProjection';
import { AsigEvidProjection } from '../interface/AsigEvidProjection';
import { EvidenciaProjection } from '../interface/EvidenciaProjection';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {
  evidenciaObj: Evidencia[] = [];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  crear(r: any): Observable<any> {
    return this.http.post<any>(`${baserUrl}/api/evidencia/crear`, r
    );
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/evidencia/actualizar/${id}`, crite);
  }
  //Metodo para listar

  getEvidencias(): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarv`);
  }

 //Metodo para listarAsigna

 /*getEvidenciasAdmin():Observable<Evidencia[]>{
  return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarvAsigna`);
}*/


getEvidenciasAdmin(id: number): Observable<Evidencia[]> {
  return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarvAsigna/${id}`);
}

getEvidenciaCrite(idcriterio: number): Observable<Evidencia[]> {
  return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/evicriterio/${idcriterio}`);
}

  eliminarEvidencia(evi: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/evidencia/eliminarlogic/${evi.id_evidencia}`, evi);
  }

  getEvidenciaIndicador(id: number): Observable<Evidencia> {
    return this.http.get<Evidencia>(`${baserUrl}/api/evidencia/listarIndicador/${id}`);
  }

  //Listar por usuario
  public getAsignacionUsuario(user: String): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/asignacionevidencia/listarEviUsua/` + user);
  }

  public geteviasig(user: String): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/buscarev/${user}`);
  }
  public getevilist(username: String): Observable<EvidenciaProjection[]> {
    return this.http.get<EvidenciaProjection[]>(`${baserUrl}/api/evidencia/evidenuser/${username}`);
  }
  public getevical(id_evidencia:number,id_modelo:number): Observable<EvidenciaCalProjection> {
    return this.http.get<EvidenciaCalProjection>(`${baserUrl}/api/evidencia/evidenciacal/${id_evidencia}/${id_modelo}`);
  }

  public getevitab(idcriterio:number): Observable<AsigEvidProjection[]> {
    return this.http.get<AsigEvidProjection[]>(`${baserUrl}/api/evidencia/eviasigtab/${idcriterio}`);
  }

  public geteviadmin(idUser:number): Observable<AsigEvidProjection[]> {
    return this.http.get<AsigEvidProjection[]>(`${baserUrl}/api/evidencia/eviasigadmin/${idUser}`);
  }
  //LISTAR RESPONSABLE
  public listarUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/usuarios/listarResDatos`);
  }

  public geteviaprobada(id_modelo:number): Observable<EvidenciasProjection[]> {
    return this.http.get<EvidenciasProjection[]>(`${baserUrl}/api/evidencia/evidenciaprobada/${id_modelo}`);
  }

  public getevirechazada(id_modelo:number): Observable<EvidenciasProjection[]> {
    return this.http.get<EvidenciasProjection[]>(`${baserUrl}/api/evidencia/evidenciarechazada/${id_modelo}`);
  }
  /*
 public listarUsuario(): Observable<any> {
    return this.http.get(`${baserUrl}/usuarios/listarResDatos`);
}
*/

  //metodo para consumir servicio @GetMapping("/listarEvidenciaPorIndicador/{id_indicador}")
  public getEvidenciaPorIndicador(id: number): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${baserUrl}/api/evidencia/listarEvidenciaPorIndicador/${id}`);
  }
  public buscar(id: number): Observable<Evidencia> {
    return this.http.get<Evidencia>(`${baserUrl}/api/evidencia/buscar/${id}`);
  }
  public listarUsuarioRes(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/usuarios/listarResponsableAdmin`);
  }
  
  public listarsolorespon(): Observable<any[]> {
    return this.http.get<any[]>(`${baserUrl}/usuarios/listarsoloResponsables`);
  }

}
