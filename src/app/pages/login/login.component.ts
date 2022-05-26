import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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

  submitlogInForm({ email, password }: any) {
    this.authService.logInEmailAndPass(email, password).subscribe(
      (result) => {
        if (result.body.admin) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/vhome']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
