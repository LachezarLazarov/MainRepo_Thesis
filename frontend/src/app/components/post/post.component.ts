import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { FilePickerService, FilePreviewModel } from 'ngx-awesome-uploader';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Adapter } from './file.picker.adapter';
import { environment } from 'src/environments/environment.development';
import { Loader } from '@googlemaps/js-api-loader';
import { PostService } from 'src/app/services/post.service';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  
  public adapter = new Adapter(this.http);
  private loader = new Loader({
    apiKey: environment.GOOGLE_API,
    version: "weekly",
    libraries: ["places"]
  });

  private coordinates: any = {lat: 0, lng: 0};

  @Output() imageClicked = new EventEmitter<FilePreviewModel>();  
  postForm: FormGroup = this.createFormGroup();
  postSuccess: boolean = false;
  createFormGroup(): FormGroup {
    return new FormGroup(
      {
        title: new FormControl("", [Validators.required, Validators.minLength(2)]),
        content: new FormControl("", [Validators.required, Validators.minLength(2)]),
      }
    );
  }

  private initAutocomplete(google: any, coordinates: any) {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
          zoom: 3,
          center: { lat: -28.024, lng: 140.887 },
      }
    );
    function addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral) {
      marker?.setMap(null);
      marker = new google.maps.Marker({
        position,
        map,
      });
      const coords = marker.getPosition()?.toJSON();
      coordinates.lat = coords?.lat;
      coordinates.lng = coords?.lng;
      marker?.addListener("click", () => {
        marker?.setMap(null);
      });
    }

    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });
    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      addMarker(event.latLng!);
    });
    let markers: google.maps.Marker[] = [];
    let marker: google.maps.Marker;

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places?.length == 0) {
        return;
      }

      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      const bounds = new google.maps.LatLngBounds();

      places?.forEach((place : any) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
        let tmp = new google.maps.Marker({
            map,
            title: place.name,
            icon: icon,
            position: place.geometry.location,
          })
          tmp.addListener("click", () => {
            marker?.setMap(null);
            tmp.setMap(null);
            marker = new google.maps.Marker({
              map,
              title: place.name,
              position: place.geometry.location,
            });
            marker?.addListener("click", () => {
              marker?.setMap(null);
            });
          });
        markers.push(marker);

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }


  public getSafeUrl(file: File | Blob): SafeResourceUrl {
    return this.fileService.createSafeUrl(file);
  }
  constructor(private fileService: FilePickerService, private http: HttpClient, private postService : PostService) { }
  ngOnInit(): void {
    this.postForm = this.createFormGroup();
    this.loader
      .load()
      .then((google: any) => {
        this.initAutocomplete(google, this.coordinates);
      })
      .catch(e => {
        console.log(e);
      });
  }

  onSubmit(): void{
    this.postSuccess = true;
    const httpObj = {
      title: this.postForm.value.title,
      content: this.postForm.value.content,
      location: this.coordinates,
      images: this.adapter.getFiles()
    }
    console.log(httpObj);
    this.postService.post(httpObj).subscribe((res : any) => {
      console.log(res);
    });
  }
  
}
