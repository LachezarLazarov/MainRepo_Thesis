import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { PostPageService } from 'src/app/services/post-page.service';
import { PostService } from 'src/app/services/post.service';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent {
  postForm: FormGroup = this.createFormGroup();
  createFormGroup(): FormGroup {
    return new FormGroup(
      {
        title: new FormControl("", [Validators.required, Validators.minLength(2)]),
        content: new FormControl("", [Validators.required, Validators.minLength(2)]),
      }
    );
  }
  constructor(private postService: PostService, private router: Router, private postPageService: PostPageService, private activeRoute: ActivatedRoute, private storageService: StorageService) { }
  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate([""]);
    }
    this.postPageService.getPost(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
      if (res.post.userId != this.storageService.getUser().id) {
        this.router.navigate([""]);
      }
      this.postForm.setValue({
        title: res.post.title,
        content: res.post.content
      });
    }
    );

  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.postForm.value.title);
    formData.append('content', this.postForm.value.content);
    this.postService.post(formData).subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/post', res.post.id]);
    });
  }

  deletePost(): void {
    this.postPageService.deletePost(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
      console.log(res);
      this.router.navigate([""]);
    });
  }
}
