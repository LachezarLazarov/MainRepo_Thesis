import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { first, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Post } from "../models/Post";
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = "http://localhost:3000/post";

  httpOptions = {
    withCredentials: true 
  };

  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,
  ) {}

  post(post: any): Observable<Post>{
    console.log(post)
    return this.http.post<Post>(this.url, post, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Post>("post")) 
    );
  }

}
