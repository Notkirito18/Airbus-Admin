import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';

import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models';
import { HttpClient } from '@angular/common/http';

interface authResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private router: Router, private http: HttpClient) {}

  provider = new GoogleAuthProvider();

  user = new BehaviorSubject<User | any>(null);

  key = 'AIzaSyDKHGQEHRrgyDKjKqRI0ln7kNo-w_Tf8y4';

  expirationTimer: any;

  signUpEmailAndPass(email: string, password: string) {
    return this.http
      .post<authResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          this.key,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            parseInt(resData.expiresIn)
          );
        })
      );
  }

  logInEmailAndPass(email: string, password: string) {
    return this.http
      .post<authResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          this.key,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((resData) => {
          console.log('resData.expiresIn', resData.expiresIn);
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            parseInt(resData.expiresIn)
          );
        })
      );
  }

  // signinWithGoogle() {
  //   const auth = getAuth();
  //   signInWithPopup(auth, this.provider)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential?.accessToken;
  //       // The signed-in user info.
  //       const user = result.user;
  //       // ...
  //       this.handleAuth(result.user.email, user.uid, token, 3600);
  //       // this.router.navigate(['/home']);
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       const email = error.email;
  //       // The AuthCredential type that was used.
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //       // ...
  //     });
  // }

  private handleAuth(email: string, id: string, token: string, expIn: number) {
    if (email && token) {
      const expDate = new Date(new Date().getTime() + expIn * 1000);
      console.log('expiration date from handel auth :', expDate);
      const user = new User(email, id, token, expDate);
      this.user.next(user);
      this.autoLogout(expIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
      console.log('saved to local storage:', user);
    }
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (userData) {
      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
      console.log('if userdata check', userData);
      console.log('loadedUser', loadedUser);
      if (loadedUser.token) {
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.autoLogout(expirationDuration);
        this.user.next(loadedUser);
        console.log(
          'auto login worked',
          'if userdata check + if loadedUser.token check'
        );
      }
    } else {
      console.log('auto login Failed');
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
}
