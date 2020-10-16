import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Subject, BehaviorSubject, iif } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiKey = environment.FIREBASE_API_KEY;
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        {
          email, // shortcut notation for email: email,
          password, // password: password,
          returnSecureToken: true, // should always be true that determines returning id and refresh token
        }
      )
      .pipe(
        catchError((errorRes) => this.handleError(errorRes)),
        tap((resData) =>
          this.handleAuthenticatedUser(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          )
        )
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorRes) => this.handleError(errorRes)),
        // catchError(this.handleError); // automatically passes
        tap((resData) =>
          this.handleAuthenticatedUser(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          )
        )
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData'); // removing saved user from local storage
    if (this.tokenExpirationTimer) {
      // if present, clear the timeout
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'An unknown Error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password entered!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email is not found!';
        break;
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already exists!';
        break;
    }
    return throwError(errorMessage);
  }

  private handleAuthenticatedUser(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: number
  ) {
    // creating new date from (adding time in ms till now + (token expiry in seconds*1000))
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user)); // user is stored in localStorage of the browser as a string
    this.autoLogout(expiresIn * 1000);
  }

  // gets called whenever the app.component / browser page refreshes
  autoLogin() {
    const userData: UserData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expiresIn = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expiresIn);
    }
  }

  autoLogout(expiresIn: number) {
    console.log(expiresIn);
    // ensuring that autoLogout occurs after the given expiresIn in ms.
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }
}
