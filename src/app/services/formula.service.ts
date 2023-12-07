import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Formulas } from '../models/Formulas';
import { Observable, map } from 'rxjs';
import baserUrl from './helper';
import { Cuantitativa } from '../models/Cuantitativa';
import { Indicador } from '../models/Indicador';
import { Cualitativa } from '../models/Cualitativa';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  constructor(private http: HttpClient) { }

  getFormulas(): Observable<Formulas[]> {
    return this.http.get<Formulas[]>(`${baserUrl}/api/formula/listarv`);
  }
  searchFormula(id: any): Observable<Formulas> {
    return this.http.get<Formulas>(`${baserUrl}/api/formula/buscar/${id}`);
  }
  crear(formu: Formulas): Observable<Formulas> {
    return this.http.post<Formulas>(`${baserUrl}/api/formula/crear`, formu);
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/formula/actualizar/${id}`, crite);
  }

  eliminar(formu: Formulas): Observable<any> {
    return this.http.put(`${baserUrl}/api/formula/eliminarlogic/${formu.id_formula}`, formu);
  }

  //SERVICIOS CUANTITATIVAS

  getCuantitativa(): Observable<Cuantitativa[]> {
    return this.http.get<Cuantitativa[]>(`${baserUrl}/api/cuantitativa/listarv`);
  }

  crearCuanti(cuanti: Cuantitativa): Observable<any> {
    return this.http.post<Cuantitativa>(`${baserUrl}/api/cuantitativa/crear`, cuanti);
  }

  actualizarCuanti(id: any, cuanti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/cuantitativa/actualizar/${id}`, cuanti);
  }

  eliminarCuanti(cuanti: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/cuantitativa/eliminarlogic/${cuanti.id_cuantitativa}`, cuanti);
  }


  //SERVICIOS CUALITATIVAS

  getIndicadors(): Observable<Indicador[]> {
    return this.http.get(`${baserUrl}/api/indicadores/listar`)
      .pipe(map((reponse) => reponse as Indicador[]));
  }

  getCualitativa(): Observable<Cualitativa[]> {
    return this.http.get<Cualitativa[]>(`${baserUrl}/api/cualitativa/listarv`);
  }

  crearCuali(cuanli: Cualitativa): Observable<any> {
    return this.http.post<Cualitativa>(`${baserUrl}/api/cualitativa/crear`, cuanli);
  }

  actualizarCuali(cuanli: Cualitativa) {
    return this.http.put(`${baserUrl}/api/cualitativa/actualizar/${cuanli.id_cualitativa}`, cuanli);
  }

  eliminarCuali(cuanli: Cualitativa): Observable<any> {
    return this.http.put(`${baserUrl}/api/cualitativa/eliminarlogic/${cuanli.id_cualitativa}`, cuanli);
  }

}
