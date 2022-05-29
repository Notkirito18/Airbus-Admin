import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GuestsService } from '../guests-service/guests.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private guestsService: GuestsService
  ) {}

  user = new BehaviorSubject<User | any>(null);

  notification = new Subject<{ msg: string; type: 'error' | 'notError' }>();

  userRank = new Subject<string>();

  expirationTimer: any;

  registerNewAdmin(username: string, email: string, password: string) {
    return this.http
      .post(
        'auth/register',
        {
          username,
          email,
          password,
          admin: true,
        },
        { headers: { key: environment.serverKey }, observe: 'response' }
      )
      .pipe(
        tap((result: any) => {
          this.handleAuth(
            result.body.email,
            result.body.userId,
            result.headers.get('authToken'),
            parseInt(result.headers.get('expires-in')),
            true,
            result.body.userId,
            result.username
          );
        })
      );
  }

  registerNewVender(username: string, email: string, password: string) {
    // getting the admin id
    const adminData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
      admin: boolean;
      userDataId: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    return this.http.post(
      'auth/register',
      {
        username,
        email,
        password,
        userDataId: adminData.userDataId,
      },
      { headers: { key: environment.serverKey }, observe: 'response' }
    );
  }

  logInEmailAndPass(email: string, password: string) {
    return this.http
      .post(
        'auth/login',
        { email, password },
        { headers: { key: environment.serverKey }, observe: 'response' }
      )
      .pipe(
        tap((result: any) => {
          console.log('backend result', result);

          this.handleAuth(
            result.body.email,
            result.body._id,
            result.headers.get('authToken'),
            result.headers.get('expires-in'),
            result.body.admin,
            result.body.userDataId,
            result.body.username
          );
        })
      );
  }

  //* handle logging in / auto logout (local storage) + calls delete all unvalid vouchers
  private handleAuth(
    email: string | null,
    _id: string,
    token: string | undefined,
    expIn: number,
    admin: boolean,
    userDataId: string,
    username: string
  ) {
    if (email && token && userDataId) {
      const expDate = new Date(new Date().getTime() + expIn * 1000);
      const user = new User(
        email,
        _id,
        token,
        expDate,
        admin,
        userDataId,
        username
      );
      this.user.next(user);
      this.autoLogout(expIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
      //calling delete all unvalid vouchers
      this.guestsService.deleteUnvalidVouchers(token, userDataId).subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error.msg);
        }
      );
    }
  }

  autoLogin() {
    const userData: {
      email: string;
      _id: string;
      _token: string;
      _tokenExpirationDate: string;
      admin: boolean;
      userDataId: string;
      username: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (userData) {
      const loadedUser = new User(
        userData.email,
        userData._id,
        userData._token,
        new Date(userData._tokenExpirationDate),
        userData.admin,
        userData.userDataId,
        userData.username
      );
      if (loadedUser.token) {
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.autoLogout(expirationDuration);
        this.user.next(loadedUser);
      }
    } else {
      return;
    }
  }

  autoLogout(expDuration: number) {
    this.expirationTimer = setTimeout(() => {
      this.logOut();
    }, expDuration);
  }

  logOut() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = null;
    this.router.navigate(['/auth']);
  }

  getStorageData() {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  }

  submitContactForm(contactInfo: any) {
    return this.http.post('contact', contactInfo, {
      headers: { key: environment.serverKey },
      observe: 'response',
    });
  }
}
