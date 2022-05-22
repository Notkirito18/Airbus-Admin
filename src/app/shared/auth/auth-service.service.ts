import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
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

  userRank = new Subject<string>();

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
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            parseInt(resData.expiresIn)
          );
        })
      );
  }

  signinWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, this.provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const idtoken = credential?.idToken;
        // The signed-in user info.
        const user = result.user;
        // ...
        this.handleAuth(result.user.email, user.uid, idtoken, 3600);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  private handleAuth(
    email: string | null,
    id: string,
    token: string | undefined,
    expIn: number
  ) {
    if (email && token) {
      const expDate = new Date(new Date().getTime() + expIn * 1000);
      const user = new User(email, id, token, expDate);
      this.user.next(user);
      this.autoLogout(expIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
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
}
