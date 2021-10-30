import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Guest } from 'src/app/shared/models';

@Component({
  selector: 'app-guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.scss'],
})
export class GuestPageComponent implements OnInit {
  guest: Guest = new Guest('', '', 0, '', new Date(), []);

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.http
        .get('https://airbus-900f9-default-rtdb.firebaseio.com/guests.json')
        .subscribe((data) => {
          const guestsArray = Object.values(data);
          for (let i = 0; i < guestsArray.length; i++) {
            if (guestsArray[i].id === params['id']) {
              this.guest = guestsArray[i];
            }
          }
        });
    });
  }
}
