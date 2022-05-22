import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginSub$!: Subscription;

  logInForm!: FormGroup;
  isLoggedIn = false;

  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServiceService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // login form
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submitlogInForm(formValue: any) {
    this.loginSub$ = this.authService
      .logInEmailAndPass(formValue.email, formValue.password)
      .subscribe(
        (response) => {
          if (
            response.localId === environment.adminId ||
            response.localId === environment.myAdminId
          ) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/vhome']);
          }
        },
        (error) => {
          this.error = 'unknown error occured';
          switch (error.error.error.message) {
            case 'EMAIL_NOT_FOUND':
              this.error = 'The email was not found';
              break;
            case 'INVALID_PASSWORD':
              this.error = 'The password is incorrect';
              break;
            case 'USER_DISABLED':
              this.error = 'The user account has been disabled';
              break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              this.error =
                'We have blocked all requests from this device due to unusual activity. Try again later';
              break;
          }
          console.log(error.error.error.message);
          this.openSnackBar(this.error);
          this.logInForm.reset();
          this.loading = false;
        }
      );
  }

  signInWithGoogle() {
    // this.authService.signinWithGoogle();
    alert('This featue will be implemented soon ');
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
