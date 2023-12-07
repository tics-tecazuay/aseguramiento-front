import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class EvaluarCualitativaService {

  constructor(private httpClient: HttpClient) { }
  //metodo para crear evaluacion cualitativa
  public createEvaluarCualitativa(evaluacionCualitativa: any): Observable<any> {
    return this.httpClient.post(`${baserUrl}/api/evaluar_cualitativa/crear`, evaluacionCualitativa);
  }

  //metodo de actualizar evaluacion cualitativa
  public updateEvaluarCualitativa(id: any, evaluacionCualitativa: any): Observable<any> {
    return this.httpClient.put(`${baserUrl}/api/evaluar_cualitativa/actualizar/${id}`, evaluacionCualitativa);
  }

}
