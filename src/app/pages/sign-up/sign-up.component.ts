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
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import {
  checkPasswordsMatching,
  passwordValidator,
  MyErrorStateMatcher,
} from 'src/app/shared/helper';

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
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordValidator]],
        confirmPassword: ['', [Validators.required, this.passwordValidator]],
      },
      { validators: [this.checkPasswordsMatching] }
    );
  }

  matcher = new MyErrorStateMatcher();

  submitSignUpForm(
    { username, email, password }: any,
    formDirective: FormGroupDirective
  ) {
    this.authService.registerNewVender(username, email, password).subscribe(
      (result) => {
        this.authService.notification.next({
          msg: 'vender account created',
          type: 'notError',
        });
        formDirective.resetForm();
        this.signUpForm.reset();
      },
      (error) => {
        this.authService.notification.next({
          msg: error.error.msg,
          type: 'error',
        });
      }
    );
  }
  checkPasswordsMatching = checkPasswordsMatching;
  passwordValidator = passwordValidator;
}
