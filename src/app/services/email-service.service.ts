import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import baserUrl from './helper';
@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
 // private API_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  sendEmail(toUser: string[], subject: string, message: string): Observable<any> {
    const emailDTO = { toUser, subject, message };
    const url = `${baserUrl}/send-email`;
    return this.http.post<any>(url, emailDTO).pipe(
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

}
