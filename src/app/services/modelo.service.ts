import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, catchError } from "rxjs";
import { Modelo } from "../models/Modelo";
import baserUrl from "./helper";
import { ModeloVistaProjection } from "../interface/ModeloVistaProjection";
import { ModelIndiProjection } from "../interface/ModelIndiProjection";
import { criteriosdesprojection } from "../interface/criteriosdesprojection";

@Injectable({
  providedIn: 'root'
})
export class ModeloService {
  constructor(private http: HttpClient) { }

  createModelo(modelo: Modelo): Observable<any> {
    return this.http.post(`${baserUrl}/api/modelo/crear`, modelo).pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }
  listarModelo(): Observable<Modelo[]> {
    return this.http
      .get(`${baserUrl}/api/modelo/listar`)
      .pipe(map((response) => response as Modelo[]));
  }  
  getModeloById(id_modelo: number): Observable<Modelo> {
    return this.http.get<Modelo>(`${baserUrl}/api/modelo/buscar/${id_modelo}`);
  }
  listarModeloExcepto(id: any): Observable<Modelo[]> {
    return this.http
      .get(`${baserUrl}/api/modelo/listarModeloExcepto/${id}`)
      .pipe(map((response) => response as Modelo[]));
  }
  eliminarlogic(id: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/modelo/eliminarlogic/${id}`, id);
  }
  modificar(modelo: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/modelo/modificar/${modelo.id_modelo}`, modelo);
  }
  getModeMaximo(): Observable<Modelo> {
    return this.http.get<Modelo>(`${baserUrl}/api/modelo/listarMax`)
  }
  getModelosVista(): Observable<ModeloVistaProjection[]> {
    return this.http.get<ModeloVistaProjection[]>(`${baserUrl}/api/modelo/datosModelo`)
  }
  getlistmodelindi(id_modelo:number): Observable<ModelIndiProjection[]> {
    return this.http.get<ModelIndiProjection[]>(`${baserUrl}/api/modelo/listmodelindi/${id_modelo}`)
  }
  getlisdescrite(id_modelo:number,nombre:string): Observable<criteriosdesprojection[]> {
    return this.http.get<criteriosdesprojection[]>(`${baserUrl}/api/modelo/listcritedes/${id_modelo}/${nombre}`)
  }
  getliscritemod(id_criterio:number,id_modelo:number): Observable<criteriosdesprojection[]> {
    return this.http.get<criteriosdesprojection[]>(`${baserUrl}/api/modelo/listcritmod/${id_criterio}/${id_modelo}`)
  }
  getcriterioadmin(id_modelo:number,id:number): Observable<criteriosdesprojection[]> {
    return this.http.get<criteriosdesprojection[]>(`${baserUrl}/api/modelo/listcriterioadmin/${id_modelo}/${id}`)
  }
}
