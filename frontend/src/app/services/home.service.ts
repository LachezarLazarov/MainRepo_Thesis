import { Injectable } from '@angular/core';

import { ErrorHandlerService } from './error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { first, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Post } from "../models/Post";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url = "http://localhost:3000/post";

  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,
  ) {}

  getPosts(): Observable<Post>{
    return this.http.get<Post>(this.url).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Post>("post")) 
    );
  }
}
