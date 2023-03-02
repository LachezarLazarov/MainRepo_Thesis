import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from "../models/User";
import { BehaviorSubject, Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:3000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: Pick<User, "id"> | undefined;

  httpOptions = {
    headers: new HttpHeaders({"Content-Type": "application/json"}),
    withCredentials: true 
  };

  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  signup(user: Omit<User, "id">): Observable<User>{
    return this.http.post<User>(`${this.url}/signup`, user, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<User>("signup")) 
    );
  }

  login(username: Pick<User, "username">, password: Pick<User, "password">): Observable<{
    token: string; userId: Pick<User, "id">
  }> {
    return this.http.post<{token: string; userId: Pick<User, "id">}>(`${this.url}/login`, {username, password}, this.httpOptions).pipe(
      first(),
      tap((tokenObject: {token: string; userId: Pick<User, "id">}) => {
        this.router.navigate([""]);
      }),
      catchError(this.errorHandlerService.handleError<{
        token: string; userId: Pick<User, "id">;
      }>("login")) 
    )
  }
  logout(): Observable<any> {
    return this.http.post(`${this.url}/logout`, { }, this.httpOptions);
  }
}
