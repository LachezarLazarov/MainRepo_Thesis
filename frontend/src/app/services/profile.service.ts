import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Post } from "../models/Post";
import { User } from "../models/User";
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url = "http://localhost:3000";
  httpOptions = {
    withCredentials: true 
  };
  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,
  ) { }
  
  getPostsByUserId(userId: string): Observable<Post>{
    console.log(`${this.url}/post/user/${userId}`);
    return this.http.get<Post>(`${this.url}/post/user/${userId}`, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Post>("post")) 
    );
  }

  getUser(userId: string): Observable<User>{
    return this.http.get<User>(`${this.url}/user/${userId}`, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<User>("user")) 
    );
  }
}
