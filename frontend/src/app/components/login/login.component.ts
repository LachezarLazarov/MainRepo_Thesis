import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.createFormGroup();
  isLoggedIn = false;

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router){}

  ngOnInit(): void {
    this.loginForm = this.createFormGroup();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup(
      {
        username: new FormControl("", [Validators.required, Validators.minLength(2)]),
        password: new FormControl("", [Validators.required, Validators.minLength(7)]),
      }
    );
  }

  login(): void{
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
    .subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoggedIn = true;
        this.router.navigate([""])
      },
    });
  }
}
