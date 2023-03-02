import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = this.createFormGroup();

  isLoggedIn = false;
  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.createFormGroup();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup(
      {
        username: new FormControl("", [Validators.required, Validators.minLength(2)]),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required, Validators.minLength(7)]),
      }
    )
  }
  onSubmit(): void{
    console.log(this.signupForm.value)
    this.authService.signup(this.signupForm.value).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoggedIn = true;
        this.router.navigate([""]);
      }
    });
    
  }
}
