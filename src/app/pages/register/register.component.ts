import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import {
  checkPasswordsMatching,
  MyErrorStateMatcher,
  passwordValidator,
} from 'src/app/shared/helper';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
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

  onFormSubmit(
    { username, email, password }: any,
    formDirective: FormGroupDirective
  ) {
    this.authService.registerNewAdmin(username, email, password).subscribe(
      (result) => {
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.registerForm.reset();
        formDirective.resetForm();
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
