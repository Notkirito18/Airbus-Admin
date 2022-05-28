import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from '../auth/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class SuperUserGuardGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      map((user) => {
        const isAdmin = user.admin;
        if (isAdmin) {
          return true;
        } else {
          return this.router.createUrlTree(['/auth/logIn']);
        }
      })
    );
  }
}
