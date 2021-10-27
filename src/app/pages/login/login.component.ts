import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginSub$!: Subscription;

  logInForm!: FormGroup;
  isLoggedIn = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    // login form
    this.logInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submitlogInForm(formValue: any) {
    this.loginSub$ = this.authService
      .logInEmailAndPass(formValue.email, formValue.password)
      .subscribe(
        (response) => {
          this.router.navigate(['/home']);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  signInWithGoogle() {
    // this.authService.signinWithGoogle();
    alert('featur will be added soon');
  }
}
