
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Rol } from '../models/Rol';
import baserUrl from './helper';
@Injectable({
  providedIn: 'root'
})
export class RolService {
  
  rolObj: Rol[] = [];
  private httpHeaders= new HttpHeaders({'Content-Type':'application/json'})
  constructor(private http:HttpClient) { }
  //Metodo para listar
  getRoles(): Observable<Rol[]> {
    return this.http
      .get(`${baserUrl}/api/rol/listarRol`)
      .pipe(map((response) => response as Rol[]));
  }
}
