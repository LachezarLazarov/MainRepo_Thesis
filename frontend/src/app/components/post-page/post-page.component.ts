import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PostPageService } from '../../services/post-page.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
  
export class PostPageComponent {
  post: any = {};
  user: any = {};
  comments: any = [];
  liked: boolean = false;
  currentUser: any = {};
  likes: any = [];
  commentForm: FormGroup = this.createFormGroup();

  createFormGroup(): FormGroup {
    return new FormGroup(
      {
        comment: new FormControl("", [Validators.required, Validators.minLength(2)]),
      }
    );
  }

  onComment(): void {
    this.postPageService.createComment(this.activeRoute.snapshot.params['id'], this.commentForm.value).subscribe((res: any) => {
      console.log(res);
      this.postPageService.getComments(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
        console.log(res);
        this.comments = res.comments;
      });
    });
  }

  constructor(public storageService: StorageService, private postPageService: PostPageService, private profileService: ProfileService, private activeRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    console.log(this.currentUser);
    if (this.storageService.isLoggedIn()) {
      this.postPageService.getLiked(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
        this.liked = res.liked;
        console.log(res);
      });
    }
    this.postPageService.getPost(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
      console.log(res);
      this.post = res.post;
      this.user = res.post.user;
      this.postPageService.getLocation(this.post.location.coordinates).subscribe((res: any) => {
        console.log(res);
        if (res.results?.length > 0) {
          this.post.location.name = '';
          res.results[0].address_components.forEach((component: any) => {
            if (!component.types.includes('plus_code')) {
              this.post.location.name += component.short_name + ', ';
            }
          });
        }
      });
    });
    this.postPageService.getLikes(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
      this.likes = res.likes;
    });
    this.postPageService.getComments(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
      console.log(res);
      this.comments = res.comments;
    });
  }
  like(): void {
    console.log(this.post.id);
    this.postPageService.like(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
      console.log(res);
      this.liked = true;
      this.postPageService.getLikes(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
        this.likes = res.likes;
      });
    });
  }

  unlike(): void {
    this.postPageService.unlike(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
      console.log(res);
      this.liked = false;
      this.postPageService.getLikes(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
        this.likes = res.likes;
      });
    });
  }
}
