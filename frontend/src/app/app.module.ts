import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule} from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from '@angular/material/tabs';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { GalleryModule } from  'ng-gallery';
import { LightboxModule, LIGHTBOX_CONFIG   } from  'ng-gallery/lightbox';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SignupComponent} from './components/signup/signup.component' ;
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PostComponent } from './components/post/post.component';
import { httpInterceptorProviders } from './helpers/http-interceptions';
import { ProfileComponent } from './components/profile/profile.component';
import { SafePipe } from './safe.pipe';
import { PostPageComponent } from './components/post-page/post-page.component';

@NgModule({
  declarations: [ 
    AppComponent, 
    NavigationComponent, 
    SignupComponent, 
    LoginComponent, 
    HomeComponent, 
    PostComponent, ProfileComponent, SafePipe, PostPageComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    ReactiveFormsModule,
    HttpClientModule,
    FilePickerModule,
    GalleryModule,
    LightboxModule,
    MatTabsModule

  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: LIGHTBOX_CONFIG,
      useValue: {
        keyboardShortcuts: false
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
