import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  isLoggedIn = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // signUp form
    this.signUpForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
  }

  submitSignUpForm(formValue: any) {}

  // async submitSignUpForm(formValue: any) {
  //   await this.authService.signUp(formValue.email, formValue.password);
  //   if (this.authService.isLoggedIn) this.isLoggedIn = true;
  // }
}
