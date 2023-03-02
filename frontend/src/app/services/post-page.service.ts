import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Post } from "../models/Post";
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class PostPageService {
  private url = "http://localhost:3000/post";
  httpOptions = {
    withCredentials: true
  };
  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,
  ) { }
  getPost(postId: any): Observable<Post>{
    return this.http.get<Post>(`${this.url}/${postId}`).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Post>("post")) 
    );
  }

  getLocation(coordinates: any): Observable<any>{
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[0]},${coordinates[1]}&key=${environment.GOOGLE_API}`).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<any>("post")) 
    );
  }

  getComments(postId: any): Observable<Post>{
    return this.http.get<Post>(`${this.url}/${postId}/comments`).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Post>("post"))
    );
  }

  createComment(postId: any, comment: any): Observable<Post>{
    return this.http.post<Post>(`${this.url}/${postId}/comment`, comment, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Post>("post"))
    );
  }

  getLikes(postId: any): Observable<Post>{
    return this.http.get<Post>(`${this.url}/${postId}/likes`).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Post>("post")) 
    );
  }

  getLiked(postId: any): Observable<Post>{
    return this.http.get<Post>(`${this.url}/${postId}/liked`, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Post>("post")) 
    );
  }

  like(postId: any): Observable<Post>{
    return this.http.post<Post>(`${this.url}/${postId}/like`, null, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Post>("post")) 
    );
  }

  unlike(postId: any): Observable<Post>{
    return this.http.post<Post>(`${this.url}/${postId}/unlike`, null, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Post>("post")) 
    );
  }
}
