import { Component } from '@angular/core';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { environment } from 'src/environments/environment.development';
import { Loader } from '@googlemaps/js-api-loader';
import { HomeService } from 'src/app/services/home.service';
import { Router } from '@angular/router';
import { PostPageService } from 'src/app/services/post-page.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private loader = new Loader({
    apiKey: environment.GOOGLE_API,
    version: "weekly",
    libraries: ["places"]
  });
  posts: any = [];
  commentForm: FormGroup = this.createFormGroup();
  createFormGroup(): FormGroup {
    return new FormGroup(
      {
        comment: new FormControl("", [Validators.required, Validators.minLength(2)]),
      }
    );
  }
  private initMap(google: any): void {
      const locations = this.posts.map((item: any) => {
        const lat = item.location.coordinates[0];
        const lng = item.location.coordinates[1];
        console.log(lat, lng);
        return {  lat: lat, lng: lng, title: item.title, id : item.id, images: item.images };
      });
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 3,
        center: { lat: 42.444567, lng: 24.7773029 }, 
      }
    );
  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });
    // Create an array of alphabetical characters used to label the markers.
    // Add some markers to the map.
      const markers = locations.map((location: any, i: number) => {
        console.log(location);
        const position = { lat: location.lat, lng: location.lng };
        const marker : google.maps.Marker = new google.maps.Marker({
          position,
        });
        const div = document.createElement("div");
        const title = document.createElement("p");
        const image = document.createElement("img");
        image.src = location.images[0];
        image.className = "container-fluid";
        title.innerHTML = location.title;
        div.appendChild(title);
        div.appendChild(image);
        div.style.width = "450px";
        div.style.height = "250px";
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
        div.id = "info-window";
        div.style.cursor = "pointer";
        div.onclick = () => {
          this.router.navigate(["/post", location.id]);
        };
    marker.addListener("click", () => {
      infoWindow.setContent(div);
      const info = document.getElementById("info-window")
      infoWindow.open(map, marker);
    });      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      return marker;
    });
    // Add a marker clusterer to manage the markers.
    var markerCluster =  new MarkerClusterer({ markers, map,  });
    console.log(markerCluster)
  }

  constructor(private homeService: HomeService, private router: Router, private postPageService: PostPageService, public storageService: StorageService) {
   }


  ngOnInit(): void {
    this.homeService.getPosts().subscribe((res: any) => {
      this.posts = res;
      this.loader
        .load()
        .then((google: any) => {
          this.initMap(google);
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  like(post : any): void {
    this.postPageService.like(post.id).subscribe((res: any) => {
      console.log(res);
      post.liked = true;
      this.postPageService.getLikes(post.id).subscribe((res: any) => {
        post.likes = res.likes;
      });
    });
  }

  unlike(post: any): void {
    this.postPageService.unlike(post.id).subscribe((res: any) => {
      console.log(res);
      post.liked = false;
      this.postPageService.getLikes(post.id).subscribe((res: any) => {
        post.likes = res.likes;
      });
    });
  }

  onComment(post: any): void {
    this.postPageService.createComment(post.id, this.commentForm.value).subscribe((res: any) => {
      console.log(res);
      this.postPageService.getComments(post.id).subscribe((res: any) => {
        console.log(res);
        post.comments = res.comments;
      });
    });
  }
}
