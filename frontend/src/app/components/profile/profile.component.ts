import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { ProfileService } from 'src/app/services/profile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(private storageService: StorageService, private profileService: ProfileService, public gallery: Gallery, private activeRoute: ActivatedRoute) { }
  galleryId = 'myLightbox';
  items: GalleryItem[] = [];
  posts: any = [];
  ngOnInit(): void {
    this.profileService.getUser(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
      console.log(res);
      this.currentUser = res.user;
    });
    this.profileService.getPostsByUserId(this.activeRoute.snapshot.params['id']).subscribe((res: any) => {
      console.log(this.activeRoute.snapshot.params['id']);
      this.posts = res.posts;
      res.posts.forEach((post: any) => {
        console.log(post);
        this.items.push(new ImageItem({ src: post.images[0], thumb: post.images[0] }));
      });
      const galleryRef = this.gallery.ref(this.galleryId);
      console.log(this.items);
      galleryRef.load(this.items);
    });
  }
}