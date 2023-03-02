import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PostComponent } from './components/post/post.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostPageComponent } from './components/post-page/post-page.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "post", component: PostComponent },
  { path: "post/:id", component: PostPageComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "profile/:id", component: ProfileComponent },
  { path: "**", redirectTo: ""},
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
