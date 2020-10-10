import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log(req.url);

    return this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          if (!user){
            return next.handle(req);
          }
          const modifiedRequest = req.clone({
            params: new HttpParams().set('auth', user.token)
          });

          return next.handle(modifiedRequest);
        })
      )

  }
}
