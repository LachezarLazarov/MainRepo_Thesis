import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { FilePickerService, FilePreviewModel } from 'ngx-awesome-uploader';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Adapter } from './file.picker.adapter';
import { environment } from 'src/environments/environment.development';
import { Loader } from '@googlemaps/js-api-loader';

type Coordinates = {latitude: number, longitude: number};
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

  private marker: Coordinates = {latitude: 0, longitude: 0};
  @Output() imageClicked = new EventEmitter<FilePreviewModel>();  
  postForm: FormGroup = this.createFormGroup();
  postSuccess: boolean = false;
  createFormGroup(): FormGroup {
    return new FormGroup(
      {
        title: new FormControl("", [Validators.required, Validators.minLength(2)]),
        content: new FormControl("", [Validators.required, Validators.minLength(2)]),
        // location: new FormControl("", [Validators.required, Validators.minLength(7)]),
      }
    );
  }

  private initAutocomplete(google: any) {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
        zoom: 3,
        center: { lat: -28.024, lng: 140.887 },
    }
  );

  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input") as HTMLInputElement;
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  let markers: google.maps.Marker[] = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places?.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
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

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      this.marker = {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()};

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
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
  constructor(private fileService: FilePickerService, private http: HttpClient) { }
  ngOnInit(): void {
    this.postForm = this.createFormGroup();
    this.loader
      .load()
      .then((google: any) => {
        this.initAutocomplete(google);
      })
      .catch(e => {
        console.log(e);
      });
  }

  onSubmit(): void{
    console.log(this.marker);
    this.postSuccess = true;
  }
  
}
