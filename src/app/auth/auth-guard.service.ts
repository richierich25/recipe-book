import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // tslint:disable-next-line: max-line-length
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // adding latest method of using urlTree for performing navigation
    return this.authService.user.pipe(
      take(1), // ensure to take only current user and validate to avoid continuos subscription
      map((user) => {
        const isAuth = !!user;
        console.log(isAuth);
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      })
    );

    // commented older method which returns a boolean and performs a redirect
    // return this.authService.user
    //   .pipe(
    //     map(user => {
    //       // return !user ? false : true;
    //       return !!user;
    //     }),
    //     tap(isAuth => {
    //       if (!isAuth) {
    //         this.router.navigate(['/auth']);
    //       }
    //     })
    //   );
  }
}
