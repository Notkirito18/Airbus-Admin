import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(private mediaObserver: MediaObserver, private fb: FormBuilder) {}
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
  onFormSubmit() {
    console.log(this.contactForm.value);
  }
}
