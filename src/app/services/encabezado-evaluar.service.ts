import { map, Observable, catchError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import baserUrl from './helper';
import { Encabezado_Evaluar } from '../models/Encabezado-Evaluar';
@Injectable({
  providedIn: 'root'
})
export class EncabezadoEvaluarService {

  constructor(private http: HttpClient) { }

  getEncabezado_Evaluar(): Observable<Encabezado_Evaluar[]> {
    return this.http.get<Encabezado_Evaluar[]>(`${baserUrl}/api/encabezado_evaluar/listarv`);
  }
  searchEncabezado_Evaluar(id:any): Observable<Encabezado_Evaluar> {
    return this.http.get<Encabezado_Evaluar>(`${baserUrl}/api/encabezado_evaluar/buscar/${id}`);
  }
  crear(r: Encabezado_Evaluar): Observable<Encabezado_Evaluar> {
    return this.http.post<Encabezado_Evaluar>(`${baserUrl}/api/encabezado_evaluar/crear`, r).pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }

  actualizar( crite: Encabezado_Evaluar): Observable<any> {
    console.log(crite)
    return this.http.put(`${baserUrl}/api/encabezado_evaluar/actualizar/${crite.id_encabezado_evaluar}`, crite);
  }

  eliminar(crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/encabezado_evaluar/eliminarlogic/${crite.id_encabezado_evaluar}`, crite);
  }


}