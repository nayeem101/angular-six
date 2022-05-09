import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IEmployee } from './interfaces/IEmployee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private httpclient: HttpClient) {}

  private baseUrl = 'http://localhost:3000/employees';

  private handleError(errResponse: HttpErrorResponse) {
    if (errResponse.error instanceof ErrorEvent) {
      console.error('client side error: ', errResponse.error.message);
    } else {
      console.error('server side error: ', errResponse);
    }

    return throwError(() => new Error('There is a problem with the service'));
  }

  getEmployees(): Observable<IEmployee[]> {
    return this.httpclient
      .get<IEmployee[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  getEmployee(id: number): Observable<IEmployee> {
    return this.httpclient
      .get<IEmployee>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateEmployee(employee: IEmployee): Observable<void> {
    return this.httpclient
      .put<void>(`${this.baseUrl}/${employee.id}`, employee, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  addEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.httpclient
      .post<IEmployee>(this.baseUrl, employee, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }
}
