import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent!.dirty);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
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

    this.signUpForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.min(6)]],
        confirmPassword: [''],
      },
      { validators: [this.checkPasswords, this.checkPasswordValidity] }
    );
  }

  matcher = new MyErrorStateMatcher();
  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value;
    return pass === confirmPass ? null : { notSame: true };
  };
  checkPasswordValidity: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password')!.value;
    let valid = false;
    let hasUpper = false;
    let hasLower = false;
    for (let i = 0; i < pass.length; i++) {
      if (pass[i].toLowerCase() === pass[i]) {
        hasLower = true;
      }
      if (pass[i].toUpperCase() === pass[i]) {
        hasUpper = true;
      }
    }
    if (hasLower && hasUpper) {
      valid = true;
    }
    return pass.length >= 6 && valid ? null : { invalid: true };
  };

  submitSignUpForm({ username, email, password }: any) {
    this.authService.registerNewVender(username, email, password).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
