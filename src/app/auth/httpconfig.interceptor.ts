import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ) {}
  
  intercept_old(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.search('/login') === -1) {
      const authToken = this.authService.getToken();
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      if(authToken) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', authToken)
        });
        // send cloned request with header to the next handler.
        return next.handle(authReq)
        .pipe(
          tap(event => {
            // if(event instanceof HttpResponse ) {
              // if(event.status == 200){
              //   if(event.body !== null && event.body.message !== undefined){
              //     Swal.fire({
              //       icon: 'success',
              //       title: event.body.message
              //     });
              //   }
              // }
            // }
            return event;
          }),
          catchError((err: HttpErrorResponse) => {
            if(err instanceof HttpErrorResponse) {
              if(err.status === 401) {
                // this.authService.removeToken();
                Swal.fire({
                  title: 'Access token failed',
                  text: 'Invalid authorization !!!. Please login again',
                  icon: 'error'
                });
              }
            }
            return throwError(err);
          })
        );
      }
    } else {
      // send cloned request with header to the next handler.
      return next.handle(req);
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.search('/login') === -1) {
      const authToken = this.authService.getToken();
      // Clone the request and replace the original headers with the authorization.
      if(authToken && !this.authService.isTokenExpired()) {
        req = req.clone({
          headers: req.headers.set('Authorization', authToken)
        });
      }
      // send cloned request with header to the next handler.
      return next.handle(req).pipe(
        catchError((err: HttpErrorResponse) => {
          if(err instanceof HttpErrorResponse) {
            if(err.status === 401 && this.authService.isTokenExpired()) {
              // Token expired, initiate renewal process
              return this.handleTokenExpiration(req, next);
            }
            return throwError(err);
          }
        })
      );
    } else {
      // send cloned request with header to the next handler.
      return next.handle(req);
    }
  }

  private handleTokenExpiration(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.renewToken({_id: localStorage.getItem('userId')}).pipe(
      switchMap((response) => {
        const newToken = response.token;
        this.authService.saveAuthData(newToken, response['permission'], response['user']['_id']);

        // Retry the original request with the new token
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });

        return next.handle(req);
      })
    );
  }
}