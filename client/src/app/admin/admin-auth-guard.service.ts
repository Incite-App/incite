import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../services/user.service';
import { InciteUser } from '../models/user';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private _userService: UserService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._userService.currentUser
      .toPromise()
      .then((user: InciteUser) => {
        return !!user && !!user.role && user.role.isSuperUser;
      });
  }
}
