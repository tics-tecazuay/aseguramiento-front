//crea un servicio para asignacion indicador
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import baserUrl from './helper';
import { AsignacionIndicador } from "../models/AsignacionIndicador";
import { AsignaIndicadorProjection } from "../interface/AsignaIndicadorProjection";

@Injectable({
    providedIn: 'root'
})
export class AsignacionIndicadorService {
    //metodo para crear asignacion indicador
    constructor(private http: HttpClient) { }


    public createAsignacionIndicador(asignacionIndicador: AsignacionIndicador): Observable<any> {
        return this.http.post(`${baserUrl}/api/asignacion_indicador/crearAsignacion`, asignacionIndicador).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    //servio para listar asignacion indicador por id modelo
    public getAsignacionIndicadorByIdModelo(idModelo: number): Observable<any> {
        return this.http.get(`${baserUrl}/api/asignacion_indicador/listarAsignacion/${idModelo}`).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }

    public getasignaindi(id: number): Observable<AsignacionIndicador[]> {
        return this.http.get<AsignacionIndicador[]>(`${baserUrl}/api/asignacion_indicador/listarasig_indi/${id}`);
      }
    

      public getasignacriterio(id_modelo: number): Observable<AsignaIndicadorProjection[]> {
        return this.http.get<AsignaIndicadorProjection[]>(`${baserUrl}/api/asignacion_indicador/asignacioncriterio/${id_modelo}`);
      }

      getEliminaasig(id_modelo: number,id_asig:number): Observable<AsignacionIndicador> {
        return this.http.delete<AsignacionIndicador>(`${baserUrl}/api/asignacion_indicador/eliminarasi/${id_modelo}/${id_asig}`);
      }
}