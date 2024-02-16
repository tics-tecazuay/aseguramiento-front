import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import baserUrl from './helper';
import { map, Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  constructor(private http: HttpClient) { }

  public obtenerCalificacion(): Observable<any> {
    return this.http.get(`${baserUrl}/api/cualitativa/listarv`).pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      }));
  }
}
