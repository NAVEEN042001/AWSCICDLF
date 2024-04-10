import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data.model";
import { jwtDecode } from 'jwt-decode';

const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({ providedIn: "root" })

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private changePasswordStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {}

  getToken() {
    //local variable value is undefined once the application is reloaded. So better to use the localStorage for persistancy
    return localStorage.getItem('token');
  }

  // getPermission() {
  //   return localStorage.getItem('permission') ? JSON.parse(localStorage.getItem('permission')) : null
  // }

  getTokenExpiryDuration() {
    return localStorage.getItem('expiration');
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // getChangePasswordStatusListener() {
  //   return this.changePasswordStatusListener.asObservable();
  // }

  isTokenExpired(): boolean {
    let tokenExpiryDuration = this.getTokenExpiryDuration();
    if (!tokenExpiryDuration) {
      return true;
    }
    return new Date() > new Date(tokenExpiryDuration);
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + "/signup", authData)
    .subscribe({
      next: (v) => {
        this.router.navigate(["/"]);
      },
      error: (e) => {
        this.authStatusListener.next(false);
      }
    });
  }
  
  saveAuthData(token: string, permission: any, userId: string) {
    localStorage.setItem('token', token);

    const decodedToken = jwtDecode(token);
    if(decodedToken.exp) {
      this.tokenTimer = new Date(decodedToken.exp * 1000);
      const tokenExpirationDate = new Date(decodedToken.exp * 1000);
      localStorage.setItem('expiration', tokenExpirationDate.toISOString());
    } else {
      localStorage.setItem('expiration', null);
    }
    
    // if(!isNaN(tokenExpirationDate.getTime())) {
    //   localStorage.setItem('expiration', tokenExpirationDate.toISOString());
    // } else {
    //   console.log('invalid date');
    //   localStorage.setItem('expiration', null);
    // }

    // if(permission) {
    //   localStorage.setItem('permission', JSON.stringify(permission));
    // } else {
    //   localStorage.setItem('permission', null);
    // }

    localStorage.setItem('userId', userId);
  }

  renewToken(body): Observable<any> {
    // Send a request to the server to renew the token
    return this.http.post(BACKEND_URL + '/renew-token', body);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
    .post<{ token: string; user: any }>(
      BACKEND_URL + "/login",
      authData
    ).subscribe({
			next: (v) => {
        const token = v['token'];
        if(token) {
          this.saveAuthData(token, v['permission'], v['user']['_id']);
          this.router.navigate(["/sales"]);
          // if (token) {
          //   const expiresInDuration = response.expiresIn;
          //   this.setAuthTimer(expiresInDuration);
          //   this.isAuthenticated = true;
          //   this.userId = response.userId;
          this.authStatusListener.next(true);
          //   const now = new Date();
          //   const expirationDate = new Date(
          //     now.getTime() + expiresInDuration * 1000
          //   );
          //   console.log(expirationDate);
          //   this.saveAuthData(token, expirationDate, this.userId);
          //   this.router.navigate(["/"]);
          // }
        }
      },
			error: (e) =>  this.authStatusListener.next(false),
		});
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  // changePassword(obj: any) {
  //   this.http.put<{ message: string }>(BACKEND_URL + "/changePassword", obj)
  //   .subscribe({
  //     next: (v) => {
  //       this.changePasswordStatusListener.next(true);
  //     },
  //     error: (e) =>  this.changePasswordStatusListener.next(false)
  //   })
  // }

  logout() {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    localStorage.clear(); //added by santhiya. Review with token renew integration code by prema
    this.router.navigate(['']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    // localStorage.removeItem('permission');
  }
  
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    // const permission = localStorage.getItem('permission');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      // permission: permission
    };
  }
}