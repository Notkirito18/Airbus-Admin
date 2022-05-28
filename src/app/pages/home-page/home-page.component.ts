import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(
    private mediaObserver: MediaObserver,
    private fb: FormBuilder,
    private authService: AuthServiceService
  ) {}
  mediaSubscription!: Subscription;
  screenSize = 'lg';
  contactForm!: FormGroup;

  ngOnInit(): void {
    //* screen size traking
    this.mediaSubscription = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.screenSize = result.mqAlias;
      }
    );
    //* contact form init
    this.contactForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      subject: [null, Validators.required],
      message: [null, Validators.required],
    });
  }
  onFormSubmit(formValue: any, formDirective: FormGroupDirective) {
    this.authService.submitContactForm(formValue).subscribe(
      (result) => {
        console.log(result);
        this.authService.notification.next({
          msg: 'Email sent',
          type: 'notError',
        });
        this.contactForm.reset();
        formDirective.resetForm();
      },
      (error) => {
        this.authService.notification.next({
          msg: error.error.msg,
          type: 'error',
        });
      }
    );
  }
}
