import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  logInForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // login form
    this.logInForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submitlogInForm(formValue: any) {
    console.log(formValue);
  }
}
