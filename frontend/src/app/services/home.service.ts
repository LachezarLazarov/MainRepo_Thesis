import { Injectable } from '@angular/core';

import { ErrorHandlerService } from './error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { first, catchError, tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Post } from "../models/Post";
import { PostPageService } from './post-page.service';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url = "http://localhost:3000/post";

  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,
    private postPageService: PostPageService,
  ) {}

  getPosts(): Observable<any>{
    return this.http.get<any>(this.url).pipe(
      map((res: any) => {
        const posts = res.posts;
        const postsWithLocation = posts.map((item: any) => {
          const post = item;
          this.postPageService.getLiked(post.id).subscribe((res: any) => {
            post.liked = res.liked;
          });
          this.postPageService.getLikes(post.id).subscribe((res: any) => {
            post.likes = res.likes;
          });
          this.postPageService.getComments(post.id).subscribe((res: any) => {
            console.log(res);
            post.comments = res.comments;
          });
          this.postPageService.getLocation(item.location.coordinates).subscribe((res: any) => {
            if (res.results?.length > 0) {
              post.location.name = '';
              res.results[0].address_components.forEach((component: any, i: number) => {
                if (!component.types.includes('plus_code')) {
                  post.location.name += component.short_name;
                  if(res.results[0].address_components.length - 1 !== i) {
                    post.location.name += ', ';
                  }
                }
              });
            }
          });
          return post;
        });
        return (postsWithLocation);
      }),
      catchError(this.errorHandlerService.handleError<Post>("post")) 
    );
  }
}
