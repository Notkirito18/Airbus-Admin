import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  signUpForm!: FormGroup;
  isLoggedIn = false;

  signUpSub$!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    // signUp form
    this.signUpForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
  }

  submitSignUpForm(formValue: any) {
    this.signUpSub$ = this.authService
      .signUpEmailAndPass(formValue.email, formValue.password)
      .subscribe(
        (response) => {
          console.log('sign up response :', response);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ngOnDestroy(): void {
    this.signUpSub$.unsubscribe();
  }
}
